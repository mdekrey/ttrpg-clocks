# Tabletop RPG clock tracker

This is a simple C#/TypeScript/React project using serverless techniques to host a site that will allow GMs to share (digitally) "clocks", such as those found in PbtA or Forged in the Dark games.

## To run it locally

1. You'll need NodeJS.
2. Ensure port 7071 is available on your machine.

   (If not, the Azure functions will run on a different port, and Gatsby will not proxy appropriately.)

3. Run [the Functions app](TtrpgClockTracker.Functions/readme.md) locally
4. Run [the Gatsby app](ttrpg-clock-ui/readme.md) locally
