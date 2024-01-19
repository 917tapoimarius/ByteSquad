-- First implementation
CREATE TABLE "User" (
   user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	email VARCHAR(100) NOT NULL,
	username VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL
);

CREATE TABLE "Destination" (
   destination_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	destination_country VARCHAR(50) NOT NULL,
	destination_city VARCHAR(100) NOT NULL,
	--destination_longitude DOUBLE NOT NULL, // to be added after first demo
	--destination_latitude DOUBLE NOT NULL, // to be added after first demo
	is_public BOOLEAN
);

CREATE TABLE "BucketList" (
	--id INT PRIMARY KEY NOT NULL, // not needed as one user can have only one bucket list
   user_id INT REFERENCES "User"(user_id),
   destination_id INT REFERENCES "Destination"(destination_id)
);

-- insert values in the tables
INSERT INTO "User"(email, username, password) VALUES ('user1@gmail.com', 'user1', 'user1');
-- SELECT * FROM "User";

INSERT INTO "Destination" (destination_country, destination_city, is_public)
VALUES
('Romania', 'Bucharest', true),
('Romania', 'Cluj-Napoca', true),
('Japan', 'Tokyo', true),
('Germany', 'Munich', true),
('USA', 'Los Angeles', true);
-- SELECT * FROM "Destination";

INSERT INTO "BucketList" VALUES
(1, 1),
(1, 4);
-- SELECT * FROM "BucketList";

-- added description column in destination table
ALTER TABLE "Destination"
ADD description VARCHAR(255);

-- SELECT * FROM "Destination";
-- added descriptions
UPDATE "Destination" 
SET description = 'Bucharest is the capital and largest city of Romania. It is described as the cultural, financial, entertainment, and media center in the country with a significant influence in Eastern and Southeastern Europe as well.'
WHERE destination_id = 1;

UPDATE "Destination" 
SET description = 'Cluj-Napoca is the second-most populous city in Romania and the seat of Cluj County in the northwestern part of the country.'
WHERE destination_id = 2;

UPDATE "Destination" 
SET description = 'Located at the head of Tokyo Bay, Tokyo is part of the Kantō region on the central coast of Honshu, Japan''s largest island. Tokyo serves as Japan''s economic center and the seat of both the Japanese government and the Emperor of Japan.'
WHERE destination_id = 3;

UPDATE "Destination" 
SET description = 'Straddling the banks of the River Isar north of the Alps, Munich is the seat of the Bavarian administrative region of Upper Bavaria, while being the most densely populated municipality in Germany with 4,500 people per km2.'
WHERE destination_id = 4;

UPDATE "Destination" 
SET description = 'Los Angeles is the financial and cultural center of the Southern California region. Los Angeles has a Mediterranean climate, an ethnically and culturally diverse population, in addition to a sprawling metropolitan area.'
WHERE destination_id = 5;

-- add destination_name field to Destionation table
-- SELECT * FROM "Destination";

ALTER TABLE "Destination"
ADD COLUMN destination_name VARCHAR(255);

-- add descriptions for the destinations
UPDATE "Destination" 
SET destination_name = 'Casa poporului'
WHERE destination_id = 1;

UPDATE "Destination" 
SET destination_name = 'Piata Unirii'
WHERE destination_id = 2;

UPDATE "Destination" 
SET destination_name = 'Tokyo Skytree'
WHERE destination_id = 3;

UPDATE "Destination" 
SET destination_name = 'Marienplatz'
WHERE destination_id = 4;

UPDATE "Destination" 
SET destination_name = 'Universal Studios Hollywood'
WHERE destination_id = 5;

-- Database updated (added new tables)
CREATE TABLE "TipsAndTricks"(
	tips_and_trick_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
	user_id INT REFERENCES "User"(user_id),
    destination_id INT REFERENCES "Destination"(destination_id),
	comment VARCHAR (255) NOT NULL
);

CREATE TABLE "Vote"(
	vote_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL,
    destination_id INT REFERENCES "Destination"(destination_id),
	month INT NOT NULL,
	number INT NOT NULL,
	UNIQUE(destination_id, month)
);

CREATE TABLE "User_Votes"(
	user_id INT REFERENCES "User"(user_id),
	vote_id INT REFERENCES "Vote"(vote_id),
	PRIMARY KEY (user_id, vote_id)
);

-- Insert data into "TipsAndTricks" table
INSERT INTO "TipsAndTricks" (user_id, destination_id, comment) VALUES
(1, 1, 'Great local restaurant to try!'),
(1, 2, 'Best hiking trails in the area'),
(1, 3, 'Avoid peak tourist times for a more peaceful experience'),
(1, 4, 'Try the local cuisine at street markets'),
(1, 5, 'Don''t forget to visit the historical landmarks');

-- Insert data into "Vote" table
INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 1, 50),
(2, 1, 30),
(3, 1, 40),
(4, 1, 25),
(5, 1, 35);

-- Insert data into "User_Votes" table
INSERT INTO "User_Votes" (user_id, vote_id) VALUES
(1, 1),
(1, 2),
(1, 3);

-- SELECT * FROM "TipsAndTricks"
-- SELECT * FROM "Vote"
-- SELECT * FROM "User_Votes"
-- inserting votes for each destination we have at the moment, with a hardcoded number

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 2, 20),
(2, 2, 40),
(3, 2, 35),
(4, 2, 15),
(5, 2, 50);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 3, 45),
(2, 3, 25),
(3, 3, 30),
(4, 3, 18),
(5, 3, 42);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 4, 28),
(2, 4, 38),
(3, 4, 22),
(4, 4, 10),
(5, 4, 48);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 5, 32),
(2, 5, 44),
(3, 5, 28),
(4, 5, 12),
(5, 5, 36);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 6, 40),
(2, 6, 20),
(3, 6, 25),
(4, 6, 16),
(5, 6, 30);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 7, 18),
(2, 7, 35),
(3, 7, 42),
(4, 7, 10),
(5, 7, 48);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 8, 26),
(2, 8, 38),
(3, 8, 20),
(4, 8, 14),
(5, 8, 45);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 9, 33),
(2, 9, 22),
(3, 9, 28),
(4, 9, 18),
(5, 9, 40);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 10, 42),
(2, 10, 15),
(3, 10, 30),
(4, 10, 12),
(5, 10, 36);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 11, 25),
(2, 11, 28),
(3, 11, 38),
(4, 11, 20),
(5, 11, 42);

INSERT INTO "Vote" (destination_id, month, number) VALUES
(1, 12, 38),
(2, 12, 18),
(3, 12, 22),
(4, 12, 10),
(5, 12, 45);

-- SELECT * FROM "Destination"

-- BS-28 #1 START
-- added new constraint
ALTER TABLE "Destination"
DROP CONSTRAINT IF EXISTS destination_name_unq,
ADD CONSTRAINT destination_name_unq UNIQUE(destination_name, destination_city);

-- added description for each bucket list item so that if a user edits a private destination's description only he can see it
ALTER TABLE "BucketList"
ADD description VARCHAR(255);

-- added descrpiption for existing entries in oreder to be able to fetch data
UPDATE "BucketList"
SET description = 'Bucharest is the capital and largest city of Romania. It is described as the cultural, financial, entertainment, and media center in the country with a significant influence in Eastern and Southeastern Europe as well.'
WHERE destination_id = 1;

UPDATE "BucketList"
SET description = 'Straddling the banks of the River Isar north of the Alps, Munich is the seat of the Bavarian administrative region of Upper Bavaria, while being the most densely populated municipality in Germany with 4,500 people per km2.'
WHERE destination_id = 4;


-- BS-28 #1 DONE

-- BS-28 #2 START

-- added ids for each bucket list entry need this for sorting the data
ALTER TABLE "BucketList"
ADD destination_in_list_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY NOT NULL;

-- added constraint: user cannot have the same destination in his bucket list twice
ALTER TABLE "BucketList"
DROP CONSTRAINT IF EXISTS user_and_destination_id_unq,
ADD CONSTRAINT user_and_destination_id_unq UNIQUE(user_id, destination_id);

-- BS-28 #2 DONE


-- BS-28 #3 START

-- added cascade for when a destination is deleted
ALTER TABLE "BucketList"
DROP CONSTRAINT IF EXISTS "BucketList_destination_id_fkey",
ADD CONSTRAINT "BucketList_destination_id_fkey"
FOREIGN KEY (destination_id) REFERENCES "Destination" (destination_id) ON DELETE CASCADE;

ALTER TABLE "TipsAndTricks"
DROP CONSTRAINT IF EXISTS "TipsAndTricks_destination_id_fkey",
ADD CONSTRAINT "TipsAndTricks_destination_id_fkey"
FOREIGN KEY (destination_id) REFERENCES "Destination" (destination_id) ON DELETE CASCADE;

ALTER TABLE "Vote"
DROP CONSTRAINT IF EXISTS "Vote_destination_id_fkey",
ADD CONSTRAINT "Vote_destination_id_fkey"
FOREIGN KEY (destination_id) REFERENCES "Destination" (destination_id) ON DELETE CASCADE;

-- BS-28 #3 DONE

-- SELECT * FROM "User"
-- SELECT * FROM "Destination"
-- SELECT * FROM "BucketList"
-- SELECT * FROM "Vote"
-- SELECT * FROM "TipsAndTricks"
-- SELECT * FROM "User_Votes"

-- BS-37 added username UNIQUE constraint
ALTER TABLE "User"
DROP CONSTRAINT IF EXISTS user_username_unq,
ADD CONSTRAINT user_username_unq UNIQUE (username);

-- addded UNIQUE constraint for destination_country, destination_name and destination_city (needed for update)
ALTER TABLE "Destination"
DROP CONSTRAINT IF EXISTS destination_name_unq,
ADD CONSTRAINT destination_name_unq UNIQUE(destination_country, destination_name, destination_city);