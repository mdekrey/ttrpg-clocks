using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Text;
using System.Text.Json.Serialization;

namespace TtrpgClockTracker.Functions
{
    public record BlobData(string OwnerId, GameState GameState)
    {
    }

    public record GameState(ImmutableDictionary<string, GameClock> Clocks) 
    {
        public static GameState Empty = new GameState(ImmutableDictionary<string, GameClock>.Empty);
    }

    public record GameClock(int CurrentTicks, int TotalTicks) { }

    public record GameAction() { }
    public record TickClockAction(string ClockName, int TickCount) : GameAction { }
    public record RemoveClockAction(string ClockName) : GameAction { }
    public record AddClockAction(string ClockName, int TotalTicks) : GameAction { }
    public record RenameClockAction(string OldClockName, string NewClockName) : GameAction { }

}
