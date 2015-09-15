## About the data collection

Original match data is collected through steam web API. Due to the error of the third tournament, TI'3 match ids are collected otherwise. The dota.json file is the transformed and cleaned data particularly for this project. Some helper methods are written in data.rb file.

## About dota.json

The data is grouped by hero id.

Each hero own an object in the array. Every object contains the performance data of that hero in the five tournament games. With the preceding number indicating the tournament number, the average figure follows. For example, "1_avg_xpm" is the average experience per minute of that hero in the first tournament.
