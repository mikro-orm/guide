CREATE TABLE person
(
    id            TEXT PRIMARY KEY,
    last_name     TEXT,
    first_name    TEXT,
    date_of_birth TEXT,
    birthplace    TEXT,
    date_of_death TEXT,
    description   TEXT,
    x_coordinate  REAL NOT NULL,
    y_coordinate  REAL NOT NULL
);

CREATE TABLE full_name
(
    id                TEXT PRIMARY KEY,
    person_id         TEXT,
    full_name         TEXT NOT NULL,
    comment           TEXT,
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE
);

CREATE TABLE nickname
(
    id               TEXT PRIMARY KEY,
    person_id        TEXT,
    nickname         TEXT NOT NULL,
    comment          TEXT,
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE
);

CREATE TABLE category
(
    id   TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE sub_category
(
    id          TEXT PRIMARY KEY,
    category_id TEXT,
    name        TEXT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
);

CREATE TABLE person_categories
(
    person_id   TEXT,
    category_id TEXT,
    PRIMARY KEY (person_id, category_id),
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE
);

CREATE TABLE person_sub_categories
(
    person_id   TEXT,
    sub_category_id TEXT,
    PRIMARY KEY (person_id, sub_category_id),
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE,
    FOREIGN KEY (sub_category_id) REFERENCES sub_category (id) ON DELETE CASCADE
);

CREATE TABLE source
(
    id        TEXT PRIMARY KEY,
    person_id INTEGER,
    source_type CHECK (source_type IN ('IMAGE_URL', 'DATA_URL', 'BOOK')) NOT NULL, -- could be "URL" or "book"
    source    TEXT,                                       -- the actual URL or book name
    location  TEXT, --image for an example or other stuff which needs to be physically stored in the server
    FOREIGN KEY (person_id) REFERENCES person (id) ON DELETE CASCADE
);


CREATE INDEX idx_person_last_name_first_name ON person (last_name, first_name);
CREATE INDEX idx_person_first_name_last_name ON person (first_name, last_name);
CREATE INDEX idx_person_birthplace ON person (birthplace);
CREATE INDEX idx_full_names_person ON full_name (person_id);
CREATE INDEX idx_nicknames_person ON nickname (person_id);
CREATE INDEX idx_person_categories_person ON person_categories (person_id);
CREATE INDEX idx_person_categories_category ON person_categories (category_id);
CREATE INDEX idx_person_sub_categories_person ON person_sub_categories (person_id);
CREATE INDEX idx_person_sub_categories_category ON person_sub_categories (sub_category_id);
CREATE INDEX idx_sources_person ON source (person_id);
