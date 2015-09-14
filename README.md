# Visualization on Dota2 The International Tournaments

## Summary

This is a visualization on the total five international tournaments(from ti1 to ti5) of Dota2. It intends to visualize all the heroes picked in each of the international tournament and the overall performance of these heroes. Also it intends to show the evolving of the tournaments.

## Design

### Initial Design

Since the large number of heroes in Dota2, I choose the bubble chart to visualize the performance of all the heroes in a single international tournament.

Visual encodings:
- What heroes are picked in a single tournament. It's encoded with hero icon on each of the bubble. Also when user hovers on that bubble, a large image is shown on the right panel.
- The win rate of the heroes is encoded on the y-axis and the right information panel.
- Other information such as average experience per minute is encoded on the x-axis. Also when user hovers on the bubble, the information panel will show all these average value.
- When user clicks the button on x-axis, bubble moves to show the selected information of these heroes.
- When user clicks the large left and right button, the tournament changes. With the evolving the tournaments, more heroes are picked. Also some heroes are fading out. Bubbles move in and out in the graph and their position changes.

