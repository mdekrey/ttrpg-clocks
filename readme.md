# Tabletop RPG clock tracker

This is a simple C#/TypeScript/React project using serverless techniques to host a site that will allow GMs to share (digitally) "clocks", such as those found in PbtA or Forged in the Dark games.

## To run it locally

1. You'll need NodeJS.
2. Ensure port 7071 is available on your machine.

   (If not, the Azure functions will run on a different port, and Gatsby will not proxy appropriately.)

3. Run [the Functions app](TtrpgClockTracker.Functions/readme.md) locally
4. Run [the Gatsby app](ttrpg-clock-ui/readme.md) locally

## Interesting bits of code

- [`useRx`](ttrpg-clock-ui/src/utils/useRx.ts) - a React hook to unwrap rxjs Observables that includes DependencyList capabilities in case the observable isn't already memoized (such as if a pipe needs to be performed). It subscribes upon mount and unsubscribes on unmount.
- [`useSignalRConnection`](ttrpg-clock-ui/src/utils/useSignalRConnection.ts) - wraps SignalR with a React hook (and includes a bit of customization for a "gamerId" header) and an rxjs Observable such that SignalR connects when the contained Observable is subscribed and disconnects when not in use.
- [d3 + React usage](ttrpg-clock-ui/src/clocks/ClockSvg.tsx) - demonstrates a way to use d3 with React such that d3 doesn't do DOM manipulation. Uses React's array mapping rather than a `.selectAll().data()` construct.
