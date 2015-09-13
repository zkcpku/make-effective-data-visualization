require "dota"
require 'mongo'

def setUp
  Dota.configure do |config|
    config.api_key = ENV.fetch("STEAM_API_KEY")
  end

  api = Dota.api
end


def getMatches
  api = setUp
  # puts api.teams(5).to_yaml

  output = File.open("matchID","a+")

  File.readlines('leagueID').each do |line|
    # puts line
    id = line.to_i
    matches = api.matches(league_id: id)
    while matches.nil?
      matches = api.matches(league_id: id)
    end

    matches.each do |match|
      output.puts(match.id)
    end
  end
end

def setPlayers(players,data,heroes)
  players.each do |player|
    data[:player_id] = player.id
    data[:hero] = player.hero.id
    data[:level] = player.level
    data[:K] = player.kills
    data[:D] = player.deaths
    data[:A] = player.assists
    data[:gold] = player.gold
    data[:LH] = player.last_hits
    data[:DN] = player.denies
    data[:XPM] = player.xpm
    data[:GPM] = player.gpm
    data[:hero_damage] = player.hero_damage
    data[:tower_damage] = player.tower_damage
    result = heroes.insert_one(data)
    puts result.n
  end
end

def convertLeague(id)
  case id
  when 65000
    return 1
  when 65001
    return 2
  when 65006,65004,65005
    return 3
  when 600
    return 4
  when 2733
    return 5
  else
    raise 'League Error'
  end
end

def setMatch(match, data, matches) 
  data[:match_id] = match.id
  data[:league] = convertLeague(match.league_id)
  all_heroes = []
  match.dire.players.each do |p|
    all_heroes << p.hero.id
  end
  match.radiant.players.each do |p|
    all_heroes << p.hero.id
  end
  data[:heroes] = all_heroes
  ban = []
  if not match.drafts.nil?
   match.drafts.each do |d|
    if not d.pick?
      ban << d.hero.id 
    end
   end
  end
  data[:ban] = ban
  data[:duration] = match.duration/60
  data[:starts_at] = match.starts_at
  result = matches.insert_one(data)
  puts result.n
end

def process(file)
  api = setUp
  client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'dota_ti')
  matches = client[:matches]
  heroes = client[:heroes]

  File.readlines(file).each do |line|
    id = line.to_i

    match = api.matches(id)
    while match.nil?
      match = api.matches(id)
    end

    match_data = {:match_id => nil,
      :league => nil,
      :heroes => nil,
      :ban => nil,
      :duration => nil,
      :starts_at => nil,
    }
    hero_data = {:match_id => nil,
      :player_id => nil,
      :team => nil,
      :hero => nil,
      :level => nil,
      :K => nil,
      :D => nil,
      :A => nil,
      :gold => nil,
      :LH => nil,
      :DN => nil,
      :XPM => nil,
      :GPM => nil,
      :result => nil,
      :hero_damage => nil,
      :tower_damage => nil,
      :league => nil
    }

    if match.players_count == 10
      setMatch(match,match_data,matches)

      hero_data[:match_id] = match.id
      hero_data[:league] = convertLeague(match.league_id)

      if match.winner == :radiant
        hero_data[:result] = 'w'
      else
        hero_data[:result] = 'l'
      end

      hero_data[:team] = match.radiant.name
      players = match.radiant.players

      setPlayers(players,hero_data,heroes)

      if match.winner == :dire
        hero_data[:result] = 'w'
      else
        hero_data[:result] = 'l'
      end

      hero_data[:team] = match.dire.name
      players = match.dire.players

      setPlayers(players,hero_data,heroes)

    end
  end
end

def addLeagueCount()
  client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'dota_ti')
  heroes = client["heroes"]
  ti_count = []
  (1..5).each do |n|
    ti_count << heroes.find(:league => n).count
  end
  ti_count
end

def aggregate()
  client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'dota_ti')
  heroes = client["heroes"]
  aggregation = heroes.find().aggregate([
    { "$group" => {"_id" => {'hero' => "$hero", 'league' => "$league", 'ti_count' => "$ti_count"},
                   "count" => {"$sum" => 1},
                   "win_count" => {"$sum" => {"$cond" => [{"$eq" => ["$result","w"]},1,0]}},
                   "avg_gpm" => {"$avg" => "$GPM"}, 
                   "avg_level" => {"$avg" => "$level"},
                   "avg_K" => {"$avg" => "$K"}, 
                   "avg_D" => {"$avg" => "$D"},
                   "avg_A" => {"$avg" => "$A"},
                   "avg_xpm" => {"$avg" => "$XPM"},
                   "avg_hero_damage" => {"$avg" => "$hero_damage"},
                   "avg_tower_damage" => {"$avg" => "$tower_damage"}}},
    { "$project" => {"win_rate" => {"$divide" => ["$win_count", "$count"]},
                     "pick_rate" => {"$divide" => ["$count", "$_id.ti_count"]},
                     "count" => 1,
                     "win_count" => 1,
                     "league" => "$_id.league",
                     "hero" => "$_id.hero",
                     "avg_xpm" => 1,
                     "avg_gpm" => 1,
                     "avg_level" => 1,
                     "avg_K" => 1,
                     "avg_D" => 1,
                     "avg_A" => 1,
                     "avg_hero_damage" => 1,
                     "avg_tower_damage" => 1}},
    { "$project" => {"_id" => 0,
                     "hero" => 1,
                     "league" => 1,
                     "pick" => "$count",
                     "pick_rate" => 1,
                     "win_rate" => 1,
                     "avg_xpm" => 1,
                     "avg_gpm" => 1,
                     "avg_level" => 1,
                     "avg_K" => 1,
                     "avg_D" => 1,
                     "avg_A" => 1,
                     "avg_hero_damage" => 1,
                     "avg_tower_damage" => 1}},
    { "$sort" => {"league" => 1, "hero" => 1}} 
   ])
  
end

def outputFields()
  client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'dota_ti')
  output = client["output"]
  a = output.find().limit(1)
  a.each do |d|
    File.open("fields","w") { |f| f.puts(d.keys) }
  end
end

def addBan()
  require 'csv'
  client = Mongo::Client.new([ '127.0.0.1:27017' ], :database => 'dota_ti')
  matches = client["matches"]
  arr = []
  CSV.foreach('test.csv', :headers =>true) do |row|
    item = row.to_hash
    league = item["league"].to_i
    hero = item["hero"].to_i
    documents = matches.find(:league => league, :ban => hero)

    count = 0
    documents.each do |d|
      count += 1
    end
    item["ban"] = count
    arr << item
  end

  CSV.open('new_data.csv', 'w', :headers => arr.first.keys) do |csv|
    csv << arr.first.keys
    arr.each do |h|
      csv << h.values
    end
  end
end


def merge()
  require 'dota'
  api = Dota.api
  require 'csv'
  headers = CSV.open('new_data.csv', 'r'){|csv| csv.first}
  headers.delete('league')
  headers.delete('hero')
  new_headers = []
  headers.each do |h|
    (1..5).each {|n| new_headers << ("#{n}_" + h)}
  end
  data = {}
  CSV.foreach('new_data.csv', :headers =>true) do |row| 
    item = row.to_hash
    hero = item['hero']
    league = item['league']
    data[hero] = data[hero] || {}
    headers.each do |h|
      data[hero][league + '_' + h] = item[h]
    end
    data[hero]['hero'] = hero
    data[hero]['name'] = api.heroes(hero.to_i).name
  end
  require 'json'
  output = []
  data.keys.sort.each do |key|
    output << data[key]
  end
  File.open('dota.json', 'w'){|f| f.write(output.to_json)}
end

merge
