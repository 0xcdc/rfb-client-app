CREATE TABLE income_level (
	id	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	income_level VARCHAR(255) NOT NULL
);

INSERT INTO income_level VALUES (0, '')

INSERT INTO income_level VALUES (1, '<$24,000')

INSERT INTO income_level VALUES (2, '$24,000 - <$40,000')

INSERT INTO income_level VALUES (3, '$40,000 - <$64,000')

INSERT INTO income_level VALUES (4, '>$64,000')
