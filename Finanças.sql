CREATE DATABASE FinancasPessoais;

USE FinancasPessoais;

CREATE TABLE GOAL (
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  ACTUAL_VALUE FLOAT,
  GOAL_VALUE FLOAT,
  ID_USER INT NOT NULL,
  FOREIGN KEY (ID_USER) REFERENCES User(ID)
);

CREATE TABLE USERS (
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  NAME VARCHAR(50) NOT NULL,
  PROFILEIMAGE VARCHAR(50),
  EMAIL VARCHAR(50) NOT NULL UNIQUE,
  PASSWORD VARCHAR(50) NOT NULL
  
);

CREATE TABLE WALLET (
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  VALUE FLOAT,
  ID_USER INT NOT NULL,
  NAME VARCHAR(50) NOT NULL,
  FOREIGN KEY (ID_USER) REFERENCES User(ID)
);

CREATE TABLE TRANSACTIONS ( 
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  VALUE FLOAT,
  TRANSACTION_DATE DATE NOT NULL,
  ID_CATEGORY INT NOT NULL,
  ID_WALLET INT NOT NULL,
  ID_CARD INT DEFAULT NULL,
  ACTUAL_INSTALLMENT INT,
  TOTAL_INSTALLMENT INT,
  IS_EXPENSE BOOLEAN NOT NULL,
  LOCATION VARCHAR(255),
  DESCRIPTION VARCHAR(255),
  FOREIGN KEY (ID_CATEGORY) REFERENCES Category(ID),
  FOREIGN KEY (ID_WALLET) REFERENCES Wallet(ID),
  FOREIGN KEY (ID_CARD) REFERENCES CreditCard(ID)
);

CREATE TABLE CATEGORY (
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  ID_USER INT NOT NULL,
  ID_ICON INT DEFAULT NULL,
  NAME VARCHAR(50) NOT NULL,
  FOREIGN KEY (ID_USER) REFERENCES User(ID),
  FOREIGN KEY (ID_ICON) REFERENCES Icon(ID)
);

CREATE TABLE ICON (
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  NAME_FONT VARCHAR(50)
);

CREATE TABLE CREDITCARD (
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  LIMITS FLOAT,
  CONSUMED_VALUE FLOAT,
  EXPIRATION DATE NOT NULL,
  NAME VARCHAR(50) NOT NULL,
  NAME_COLOR VARCHAR(50)
);

CREATE TABLE SUBCATEGORY (
  ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  ID_CATEGORY INT NOT NULL,
  NAME VARCHAR(50) NOT NULL,
  FOREIGN KEY (ID_CATEGORY) REFERENCES Category(ID)
);