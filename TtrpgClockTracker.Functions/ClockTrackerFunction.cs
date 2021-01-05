using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TtrpgClockTracker.Functions
{
    public static class ClockTrackerFunction
    {
        private static readonly System.Text.Json.JsonSerializerOptions jsonOptions = new System.Text.Json.JsonSerializerOptions
        {
            PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase,
        };

        private static readonly TimeSpan TimeLimit = TimeSpan.FromDays(30);
        private const string SignalRHubName = "clocks";
        private const string BlobStorageContainerName = "clocks";
        private const string BlobStorageBlobName = "{headers.x-game-id}.json";
        private const string BlobStorageBlobFullName = BlobStorageContainerName + "/" + BlobStorageBlobName;

        [FunctionName("negotiate")]
        public static SignalRConnectionInfo Negotiate(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalRConnectionInfo(HubName = SignalRHubName, UserId = "{headers.x-gamer-id}")] SignalRConnectionInfo connectionInfo)
        {
            return connectionInfo;
        }

        [FunctionName("cleanup")]
        // Once every day at midnight...
        public static async Task Cleanup([TimerTrigger("0 0 0 * * *")] TimerInfo myTimer, ILogger log,
            [Blob(BlobStorageContainerName, FileAccess.Read)] CloudBlobContainer blobContainer)
        {
            BlobContinuationToken? continuationToken = null;
            do
            {
                var response = await blobContainer.ListBlobsSegmentedAsync(continuationToken);
                continuationToken = response.ContinuationToken;
                foreach (var blob in response.Results)
                {
                    if (blob is CloudBlob cloudBlob &&
                        cloudBlob is { Properties: { LastModified: DateTimeOffset lastModified } } &&
                        lastModified < DateTimeOffset.Now.Subtract(TimeLimit))
                    {
                        await cloudBlob.DeleteIfExistsAsync();
                    }
                }
            }
            while (continuationToken != null);

        }

        [FunctionName("getGameState")]
        public static async Task<IActionResult> GetGame(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get")] HttpRequest req,
            [SignalR(HubName = SignalRHubName)] IAsyncCollector<SignalRGroupAction> signalRGroupActions,
            [SignalR(HubName = SignalRHubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            [Blob(BlobStorageBlobFullName, FileAccess.Read)] string gameState,
            [Blob(BlobStorageContainerName, FileAccess.Read)] CloudBlobContainer blobContainer)
        {
            var gamerId = req.Headers.TryGetValue("x-gamer-id", out var values) ? values.SingleOrDefault() : null;
            var gameId = req.Headers["x-game-id"].Single();

            // get game
            var blobData = gameState != null
                ? System.Text.Json.JsonSerializer.Deserialize<BlobData>(gameState)
                : null;
            if (blobData == null)
            {
                if (gamerId == null)
                    return new NotFoundResult();
                blobData ??= new BlobData(gamerId, GameState.Empty);
            }
            if (gameState == null)
            {

                await blobContainer.CreateIfNotExistsAsync();
                var blob = blobContainer.GetBlockBlobReference(BlobStorageBlobName.Replace("{headers.x-game-id}", gameId));
                blob.Properties.ContentType = "application/json";

                using var write = await blob.OpenWriteAsync();
                await System.Text.Json.JsonSerializer.SerializeAsync(write, blobData);
            }

            // add user to the group
            await signalRGroupActions.AddAsync(
                new SignalRGroupAction
                {
                    UserId = gamerId,
                    GroupName = gameId,
                    Action = GroupAction.Add
                });

            await signalRMessages.AddAsync(CreatePublicStateMessage(gameId, blobData.GameState, null, message => message.UserId = gamerId));

            return new OkObjectResult(gamerId == blobData.OwnerId);
        }

        [FunctionName("addClock")]
        public static async Task<IActionResult> AddClock(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalR(HubName = SignalRHubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            [Blob(BlobStorageBlobFullName, FileAccess.ReadWrite)] CloudBlockBlob blob)
        {
            return await DoAction<AddClockAction>(req, signalRMessages, blob);
        }

        [FunctionName("removeClock")]
        public static async Task<IActionResult> RemoveClock(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalR(HubName = SignalRHubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            [Blob(BlobStorageBlobFullName, FileAccess.ReadWrite)] CloudBlockBlob blob)
        {
            return await DoAction<RemoveClockAction>(req, signalRMessages, blob);
        }

        [FunctionName("tickClock")]
        public static async Task<IActionResult> TickClock(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalR(HubName = SignalRHubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            [Blob(BlobStorageBlobFullName, FileAccess.ReadWrite)] CloudBlockBlob blob)
        {
            return await DoAction<TickClockAction>(req, signalRMessages, blob);
        }

        [FunctionName("renameClock")]
        public static async Task<IActionResult> RenameClock(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req,
            [SignalR(HubName = SignalRHubName)] IAsyncCollector<SignalRMessage> signalRMessages,
            [Blob(BlobStorageBlobFullName, FileAccess.ReadWrite)] CloudBlockBlob blob)
        {
            return await DoAction<RenameClockAction>(req, signalRMessages, blob);
        }

        private static async Task<IActionResult> DoAction<TAction>(HttpRequest req, IAsyncCollector<SignalRMessage> signalRMessages, CloudBlockBlob blob)
            where TAction : GameAction
        {
            var gamerId = req.Headers["x-gamer-id"].Single();
            var gameId = req.Headers["x-game-id"].Single();

            // get game
            using var blobReader = await blob.OpenReadAsync();
            var blobData = await System.Text.Json.JsonSerializer.DeserializeAsync<BlobData>(blobReader);
            if (blobData?.OwnerId != gamerId)
                return new ForbidResult();

            var actionJson = await req.ReadAsStringAsync();
            var action = System.Text.Json.JsonSerializer.Deserialize<TAction>(actionJson, jsonOptions);
            if (action == null)
                return new BadRequestResult();

            var (next, valid) = GameLogic.PerformAction(blobData.GameState, action);
            if (!valid)
                return new BadRequestResult();
            await signalRMessages.AddAsync(CreatePublicStateMessage(gameId, next, action));

            using var write = await blob.OpenWriteAsync();
            await System.Text.Json.JsonSerializer.SerializeAsync(write, blobData with { GameState = next });
            return new OkResult();
        }

        private static SignalRMessage CreatePublicStateMessage(string gameId, GameState state, GameAction? action = null, Action<SignalRMessage>? initializer = null)
        {
            initializer ??= message => message.GroupName = gameId;
            var result = new SignalRMessage
            {
                Target = "NewPublicState",
                Arguments = new[]
                {
                    gameId,
                    System.Text.Json.JsonSerializer.Serialize(state, jsonOptions)
                }
            };
            initializer(result);
            return result;
        }
    }
}
