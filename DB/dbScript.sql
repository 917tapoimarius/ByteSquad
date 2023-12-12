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

INSERT INTO "User"(email, username, password) VALUES ('user1@gmail.com', 'user1', 'user1');
SELECT * FROM "User";

INSERT INTO "Destination" (destination_country, destination_city, is_public)
VALUES
('Romania', 'Bucharest', true),
('Romania', 'Cluj-Napoca', true),
('Japan', 'Tokyo', true),
('Germany', 'Munich', true),
('USA', 'Los Angeles', true);
SELECT * FROM "Destination";

INSERT INTO "BucketList" VALUES
(1, 1),
(1, 4);
SELECT * FROM "BucketList";

ALTER TABLE "Destination"
ADD description VARCHAR(255);

SELECT * FROM "Destination";

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
SELECT * FROM "Destination";

ALTER TABLE "Destination"
ADD COLUMN destination_name VARCHAR(255);

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