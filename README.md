# Visualization on Dota2 The International Tournaments

## Summary

This is a visualization on the total five international tournaments(from ti1 to ti5) of Dota2. It intends to visualize all the heroes picked in each of the international tournament and the overall performance of these heroes. Also it intends to show the evolving of the tournaments.

## Design

### Initial Design

Since the large number of heroes in Dota2, I choose the bubble chart to visualize the performance of all the heroes in a single international tournament. As a variation of a scatter plot, not only can the bubble chart visualize each hero's performance values through the xy location, but it can also give intuition of other information to readers through the size and pattern of the bubble. Also with the hope that the movement of the bubble can show the variation of heroes with the evolving of Dota2 tournament games. The visualisation is mainly targeted to dota 2 fans. Choosing win rate as the invariant y-axis is because the win rate is one of the most important metrics to judge a hero on a single tournament although that is not necessarily true when the number of picks is low. But apart from the win rate, there remains a lot of metrics of the single hero. All these metrics may reveal some part of the hero performance in the tournament. The viewers can explore the data on their own with these metrics. That is why so much freedom is given to the viewer over x-axis.

Visual encodings:

- What heroes are picked in a single tournament is encoded with hero icon on each of the bubble. Also when user hovers on that bubble, a large image is shown on the right panel.
- The win rate of the heroes is encoded on the y-axis and the right information panel.
- Other information such as average experience per minute is encoded on the x-axis. Also when user hovers on the bubble, the information panel will show all these average value.
- When user clicks the button on x-axis, bubble moves to show the selected information of these heroes.
- When user clicks the large left and right button, the tournament changes. With the evolving the tournaments, more heroes are picked. Also some heroes are fading out. Bubbles move in and out in the graph and their position changes.
- The size of the bubble indicates whether that hero is popular in that tournament. That is to say, the larger number of bans and picks, the bigger the bubble is.

Some changes after feedback:

v0.1-v0.3:

- Add theme background with each tournament.
- Fix data error in the third tournament.
- Redesign the left and right buttons to make the UI clear.
- Change the size of the bubbles.
- Add pick rate on the x-axis.
- Enlarge and beautify the information panel.
- Add terms explanation and some introductory to the visualization.
- Add a walk through.

v0.4:

- Rescale circle size.
- Remove background image.
- Accurate the scale at 0% and 100% y-axis.
- Put my own findings of the plot in the tour.
- Change title number to year for clarification.
- Switch default x-axis data to pick rate value.
- Add initial design explain.
- Add another feedback from Udacity.
- Show what heroes were not picked in each TI.
- Let viewer click a single hero to track over TIs.

## Feedback:

- From reddit/r/dota2 user Raydano
> 0% winrate Naga Siren at TI3? that doesnt seem right

- From reddit/r/dota2 user Vespener
> Well, 2 games sometimes isn't enough to be counted. I think that sucess of a hero should take into consideration more factors like how many times it was picked, how many teams picked that hero, what role it was played, etc. For example, Lina core might be a lot more successful than Lina support. Maybe they're both equally good, which means the hero is superstrong. IDK, it depends on how you want to put it.

- From reddit/r/dota2 user oggius
> um... ti3? not sure how you can say ti5 was well balanced when at ti5 there were basically 2 viable strategies (secret's qop/sf semi-carries and cdec's gyro/pl hyperaggression). ti3 had insane variety, with many teams basically having a meta of their own. the ti3 finals featured a clash of two completely different play styles, each of which was very viable. As for enjoyable, that's obv up to each person to decide, but id say ti3 wins there too -- the days of fun tri v tri action (gyro, weaver, lifestealer were popular carries, cm, visage, naga popular supports), epic base races and late game fights, and of course insane wisp plays from many teams

- More feedbacks in this [post](https://www.reddit.com/r/DotA2/comments/3kxa8o/from_ti1_to_ti5/)

- From Udacity coach
> I had trouble understanding the chart until after I read the README file. Please add more context to the chart explaining what the chart represents. It could be with a short paragraph explaining to the reader what this game is and how it is played, what "international 1" vs the other international numbers mean, etc. It would also be helpful if the x-axis variables were explained to the reader. Also the chart titles could be more detailed.

- From another coach
> I don't think this is dependent on the viewer having a deep understanding of the subject matter; a story should be visible even to a non-expert. For example, I might not understand what an "Assist" is, but I should be able to see something interesting about how they've changed over time, how they're distributed between different heroes, or something else.

## Resources
[Dota2 Web API](https://wiki.teamfortress.com/wiki/WebAPI)

[D3 and Angular](https://www.dashingd3js.com/d3-resources/d3-and-angular)

[d3-fill-shape-with-image-using-pattern](http://stackoverflow.com/questions/25881186/d3-fill-shape-with-image-using-pattern)

[D3 API reference](https://github.com/mbostock/d3/wiki/API-Reference)

[AngularJS API Docs](https://docs.angularjs.org/api)

[jQuery API](https://api.jquery.com/)
