DROP TABLE IF EXISTS cities

DROP TABLE IF EXISTS city

CREATE TABLE city (
	id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	name varchar(255) NOT NULL UNIQUE,
	break_out	int NOT NULL,
	in_king_county int NOT NULL
)

INSERT INTO city ("id", "name", "break_out", "in_king_county") VALUES (0, 'Unknown', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Algona', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Ames Lake', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Auburn', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Baring', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Beaux Arts Village', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Bellevue', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Berrydale', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Black Diamond', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Bonney Lake', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Bothell', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Boulevard Park', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Bruster', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Bryn Mawr', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Burien', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Carnation', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Clyde Hill', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Cottage Lake', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Covington', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Des Moines', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Duvall', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('East Renton Highlands', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Enumclaw', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Everett', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Fairwood', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Fall City', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Federal Way', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Fife', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Hobart', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Hunts Point', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Issaquah', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Kenmore', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Kent', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Kirkland', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Klahanie', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lake City', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lake Desire', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lake Forest Park', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lake Holm', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lake Marcel', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lake Morton', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lakeland North', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lakeland South', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Lynnwood', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Maple Falls', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Maple Heights', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Maple Valley', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Medina', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Mercer Island', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Mill Creek', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Milton', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Mirrormont', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Monroe', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Mountlake Terrace', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Newcastle', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Normandy Park', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('North Bend', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Novelty Hill', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Olympia', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Pacific', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Puyallup', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Pullman', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Ravensdale', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Redmond', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Renton', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Reverton', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Riverband', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Sammamish', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('SeaTac', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Seattle', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Shadow Lake', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Shoreline', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Skykomish', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Skyway', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Snohomish', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Snoqualmie', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Stillwater', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Sultan', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Tacoma', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Tanner', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Toppenish', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Tukwila', '1', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Union Hill', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Vashon', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Vashon Island', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Westwood', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('White Center', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('White Salmon', '0', '0')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Wilderness Run', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Woodinville', '0', '1')

INSERT INTO city ("name", "break_out", "in_king_county") VALUES ('Yarrow Point', '0', '1')
