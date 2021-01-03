using System;
using System.Collections.Generic;
using System.Text;

namespace TtrpgClockTracker.Functions
{
    public static class GameLogic
    {
        internal static (GameState next, bool isValid) PerformAction(GameState gameState, GameAction action)
        {
            return action switch
            {
                AddClockAction addClock when addClock.TotalTicks > 0 && !gameState.Clocks.ContainsKey(addClock.ClockName) =>
                    (gameState with { Clocks = gameState.Clocks.Add(addClock.ClockName, new GameClock(CurrentTicks: 0, TotalTicks: addClock.TotalTicks)) }, true),
                TickClockAction tick when gameState.Clocks.TryGetValue(tick.ClockName, out var clock) =>
                    (
                        gameState with 
                        { 
                            Clocks = gameState.Clocks
                                .SetItem(tick.ClockName, clock with { CurrentTicks = Math.Clamp(clock.CurrentTicks + tick.TickCount, 0, clock.TotalTicks) })
                        }, 
                        true
                    ),
                RemoveClockAction { ClockName: var clockName } when gameState.Clocks.ContainsKey(clockName) =>
                    (gameState with { Clocks = gameState.Clocks.Remove(clockName) }, true),
                RenameClockAction rename when gameState.Clocks.TryGetValue(rename.OldClockName, out var clock) =>
                    (gameState with { Clocks = gameState.Clocks.Remove(rename.OldClockName).Add(rename.NewClockName, clock) }, true),

                _ => (gameState, false)
            };
        }
    }
}
