# Visualization on Dota2 The International Tournaments

## Summary

This is a visualization on the total five international tournaments(from ti1 to ti5) of Dota2. It intends to visualize all the heroes picked in each of the international tournament and the overall performance of these heroes. Also it intends to show the evolving of the tournaments.

## Design

### Initial Design

Since the large number of heroes in Dota2, I choose the bubble chart to visualize the performance of all the heroes in a single international tournament. Also with the hope that the movement of the bubble can show the evolving of Dota2 tournament games.

Visual encodings:

- What heroes are picked in a single tournament is encoded with hero icon on each of the bubble. Also when user hovers on that bubble, a large image is shown on the right panel.
- The win rate of the heroes is encoded on the y-axis and the right information panel.
- Other information such as average experience per minute is encoded on the x-axis. Also when user hovers on the bubble, the information panel will show all these average value.
- When user clicks the button on x-axis, bubble moves to show the selected information of these heroes.
- When user clicks the large left and right button, the tournament changes. With the evolving the tournaments, more heroes are picked. Also some heroes are fading out. Bubbles move in and out in the graph and their position changes.
- The size of the bubble indicates whether that hero is popular in that tournament. That is to say, the larger number of bans and picks, the bigger the bubble is.

Some changes after feedback:

- Add theme background with each tournament.
- Fix data error in the third tournament.
- Redesign the left and right buttons to make the UI clear.
- Change the size of the bubbles.
- Add pick rate on the x-axis.
- Enlarge and beautify the information panel.

## Feedback:

- From reddit/r/dota2 user Raydano
> 0% winrate Naga Siren at TI3? that doesnt seem right

- From reddit/r/dota2 user Vespener
> Well, 2 games sometimes isn't enough to be counted. I think that sucess of a hero should take into consideration more factors like how many times it was picked, how many teams picked that hero, what role it was played, etc. For example, Lina core might be a lot more successful than Lina support. Maybe they're both equally good, which means the hero is superstrong. IDK, it depends on how you want to put it.

- From reddit/r/dota2 user oggius
> um... ti3? not sure how you can say ti5 was well balanced when at ti5 there were basically 2 viable strategies (secret's qop/sf semi-carries and cdec's gyro/pl hyperaggression). ti3 had insane variety, with many teams basically having a meta of their own. the ti3 finals featured a clash of two completely different play styles, each of which was very viable. As for enjoyable, that's obv up to each person to decide, but id say ti3 wins there too -- the days of fun tri v tri action (gyro, weaver, lifestealer were popular carries, cm, visage, naga popular supports), epic base races and late game fights, and of course insane wisp plays from many teams

- More feedbacks in this [post](https://www.reddit.com/r/DotA2/comments/3kxa8o/from_ti1_to_ti5/)

## Resources
[Dota2 Web API](https://wiki.teamfortress.com/wiki/WebAPI)

[D3 and Angular](https://www.dashingd3js.com/d3-resources/d3-and-angular)

[d3-fill-shape-with-image-using-pattern](http://stackoverflow.com/questions/25881186/d3-fill-shape-with-image-using-pattern)

[D3 API reference](https://github.com/mbostock/d3/wiki/API-Reference)

[AngularJS API Docs](https://docs.angularjs.org/api)

[jQuery API](https://api.jquery.com/)
