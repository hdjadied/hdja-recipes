CREATE DATABASE IF NOT EXISTS recipes_db;

USE recipes_db;

CREATE TABLE IF NOT EXISTS recipes (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    instructions TEXT,
    cook_time VARCHAR(255),
    servings INT DEFAULT 0,
    images TEXT,
    data_hash VARCHAR(64) UNIQUE
);

CREATE TABLE IF NOT EXISTS ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    recipe_id VARCHAR(255),
    ingredient_id INT,
    quantity VARCHAR(255),
    unit VARCHAR(255),
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recipe_tags (
    recipe_id VARCHAR(255),
    tag_id INT,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

SET GLOBAL validate_password.policy = LOW;
DROP USER IF EXISTS 'recipe_user'@'localhost';
CREATE USER 'recipe_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT ALL PRIVILEGES ON recipes_db.* TO 'recipe_user'@'localhost';
FLUSH PRIVILEGES;