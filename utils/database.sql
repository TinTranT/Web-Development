CREATE DATABASE OnlineNewspaperDB;
USE OnlineNewspaperDB;

-- Account table

CREATE TABLE Account (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Dob DATE,
    Name VARCHAR(255),
    PenName VARCHAR(255),
    Role INT NOT NULL,
    SubcribeExpireDate DATE,
    EditorId INT
);

INSERT INTO Account (Password, Email, Dob, Name, PenName, Role, SubcribeExpireDate, EditorId) VALUES
('password123', 'john.doe@example.com', '1990-05-15', 'John Doe', 'JDWriter', 1, '2024-12-31', NULL), 
('authorpass111', 'alice.brown@example.com', '1995-02-20', 'Alice Brown', 'AliceB', 1, '2025-06-30', NULL),
('guestpass222', 'guest@example.com', '2000-10-01', 'Guest User', NULL, 1, NULL, NULL),
('writerpass333', 'bob.writer@example.com', '1998-09-12', 'Bob Writer', 'BWriter', 1, '2024-09-15', 2),
('subscribed444', 'susan.subscriber@example.com', '1993-01-30', 'Susan Subscriber', NULL, 1, '2025-01-01', NULL),
('securepass456', 'jane.smith@example.com', '1985-11-22', 'Jane Smith', 'JaneS', 2, NULL, 1), 
('adminpass789', 'admin@example.com', '1980-03-10', 'Admin User', NULL, 3, NULL, NULL),
('editorpass999', 'editor@example.com', '1992-07-18', 'Editor User', NULL, 4, NULL, 3);


-- news table

CREATE TABLE News (
    NewsID INT PRIMARY KEY AUTO_INCREMENT,
    WriterID INT NOT NULL,
    Thumbnail VARCHAR(255),
    Title VARCHAR(255) NOT NULL,
    PublishDate DATE,
    Abstract TEXT,
    Content TEXT NOT NULL,
    CatID INT,
    PremiumFlag BOOLEAN DEFAULT FALSE,
    Status INT NOT NULL,
    ViewCount INT DEFAULT 0,
    FOREIGN KEY (WriterID) REFERENCES Account(Id),
    FOREIGN KEY (CatID) REFERENCES Category(CatID)
);

-- Insert sample data into the `news` table
INSERT INTO news (WriterID, Thumbnail, Title, PublishDate, Abstract, Content, CatID, PremiumFlag, Status, ViewCount)
VALUES
(1, 'thumbnail1.jpg', 'Breaking News: AI Revolution', '2024-12-01', 'A brief overview of AI advancements.', 
    'In this article, we delve into the latest developments in AI technology and their implications on various industries.', 
    10, TRUE, 1, 123),
(2, 'thumbnail2.jpg', 'The Rise of Electric Vehicles', '2024-12-05', 'Exploring the surge in EV adoption.', 
    'Electric vehicles are transforming the automotive landscape. This article discusses market trends, challenges, and the road ahead.', 
    11, FALSE, 1, 89),
(3, NULL, 'Climate Change: Urgent Action Required', '2024-12-07', 'The climate crisis and its global impact.', 
    'This article examines the ongoing effects of climate change and highlights actions needed to address this critical issue.', 
    12, TRUE, 1, 156),
(4, 'thumbnail4.jpg', 'The Future of Space Exploration', '2024-12-08', 'A journey into the stars.', 
    'Space exploration is reaching new heights with advancements in technology and global collaborations.', 
    13, FALSE, 1, 67),
(5, 'thumbnail5.jpg', 'Health and Wellness Trends for 2025', '2024-12-09', 'Key health trends shaping the future.', 
    'From AI in healthcare to personalized medicine, this article explores emerging trends in health and wellness.', 
    14, TRUE, 1, 205);

-- Additional sample data for the `news` table
INSERT INTO news (WriterID, Thumbnail, Title, PublishDate, Abstract, Content, CatID, PremiumFlag, Status, ViewCount)
VALUES
(6, 'thumbnail6.jpg', 'Advancements in Renewable Energy', '2024-12-10', 'Renewable energy technologies are evolving rapidly.', 
    'This article discusses the latest breakthroughs in renewable energy, including solar and wind power.', 
    15, FALSE, 1, 98),
(7, NULL, 'The Impact of Social Media on Society', '2024-12-10', 'Social media is transforming communication and culture.', 
    'An in-depth look at how social media platforms are shaping societal trends and behaviors.', 
    16, TRUE, 1, 147),
(8, 'thumbnail8.jpg', 'Exploring the Metaverse', '2024-12-11', 'The metaverse is redefining digital interaction.', 
    'Learn about the growing metaverse ecosystem, its key players, and future prospects.', 
    17, TRUE, 1, 112),
(9, NULL, 'The Evolution of Cryptocurrency', '2024-12-12', 'Cryptocurrencies are revolutionizing the financial world.', 
    'From Bitcoin to decentralized finance, this article covers the latest in the world of digital currencies.', 
    18, FALSE, 1, 76),
(10, 'thumbnail10.jpg', 'The Role of AI in Education', '2024-12-13', 'AI is reshaping learning and teaching methods.', 
    'This article explores how AI-powered tools are transforming education, making it more personalized and accessible.', 
    10, FALSE, 1, 134),
(1, 'thumbnail11.jpg', 'Cybersecurity Trends for 2025', '2024-12-14', 'Cyber threats are becoming more sophisticated.', 
    'Discover key cybersecurity trends and how organizations can stay ahead of emerging threats.', 
    11, TRUE, 1, 203),
(2, 'thumbnail12.jpg', 'The Next Era of Smart Cities', '2024-12-15', 'Smart cities are leveraging AI and IoT for efficiency.', 
    'An exploration of how smart cities are using technology to improve urban living.', 
    12, TRUE, 1, 176),
(3, 'thumbnail13.jpg', 'Sustainability in Fashion', '2024-12-16', 'Fashion is embracing sustainable practices.', 
    'A discussion on sustainable materials, ethical practices, and the future of the fashion industry.', 
    13, FALSE, 1, 58),
(4, NULL, 'Breakthroughs in Biotechnology', '2024-12-17', 'Biotech is driving innovation in medicine and agriculture.', 
    'Learn about the latest breakthroughs in biotechnology and their potential impact on society.', 
    14, TRUE, 1, 125),
(5, 'thumbnail14.jpg', 'Global Economic Trends for 2025', '2024-12-18', 'Analyzing key trends in the global economy.', 
    'This article delves into economic trends, challenges, and opportunities shaping the near future.', 
    15, FALSE, 1, 92);


-- Assume `Status` values:
-- 1: Published, 0: Draft
-- `PremiumFlag` indicates whether the news is for premium users (TRUE/FALSE).


-- RejectReason table

CREATE TABLE RejectReason (
    ID INT PRIMARY KEY AUTO_INCREMENT,
    EditorID INT NOT NULL,
    Reason TEXT NOT NULL,
    FOREIGN KEY (EditorID) REFERENCES Account(Id)
);

CREATE TABLE Tag (
    TagID INT PRIMARY KEY AUTO_INCREMENT,
    TagName VARCHAR(255) UNIQUE NOT NULL
);

-- Category table

CREATE TABLE Category (
    CatID INT PRIMARY KEY AUTO_INCREMENT,
    CatName VARCHAR(255) NOT NULL,
    CatParentID INT
);

INSERT INTO Category (CatParentID, CatName) VALUES 
(NULL, 'International'),
(NULL, 'Sports'),
(NULL, 'Health'),
(NULL, 'Entertainment'),
(NULL, 'Technology'),
(NULL, 'Education'),
(NULL, 'Law'),
(NULL, 'Lifestyle'),
(NULL, 'Travel');

-- Danh mục con của 'International'
-- Create a temporary table to store the CatID of 'International'
CREATE TEMPORARY TABLE TempCategory AS
SELECT CatID FROM Category WHERE CatName = 'International';

-- Insert subcategories for 'International'
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Americas' FROM TempCategory;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Asia' FROM TempCategory;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Africa' FROM TempCategory;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Europe' FROM TempCategory;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Australia' FROM TempCategory;

-- Drop the temporary table
DROP TEMPORARY TABLE TempCategory;

-- Danh mục con của 'Sports'
CREATE TEMPORARY TABLE TempSports AS
SELECT CatID FROM Category WHERE CatName = 'Sports';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Football' FROM TempSports;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Badminton' FROM TempSports;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Athletics' FROM TempSports;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Cycling' FROM TempSports;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Tennis' FROM TempSports;

DROP TEMPORARY TABLE TempSports;

-- Danh mục con của 'Health'
CREATE TEMPORARY TABLE TempHealth AS
SELECT CatID FROM Category WHERE CatName = 'Health';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Food' FROM TempHealth;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Fitness' FROM TempHealth;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Sleep' FROM TempHealth;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Mindfulness' FROM TempHealth;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Relationship' FROM TempHealth;

DROP TEMPORARY TABLE TempHealth;

-- Danh mục con của 'Entertainment'
CREATE TEMPORARY TABLE TempEntertainment AS
SELECT CatID FROM Category WHERE CatName = 'Entertainment';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Movies' FROM TempEntertainment;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Television' FROM TempEntertainment;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Celebrity' FROM TempEntertainment;

DROP TEMPORARY TABLE TempEntertainment;

-- Danh mục con của 'Technology'
CREATE TEMPORARY TABLE TempTechnology AS
SELECT CatID FROM Category WHERE CatName = 'Technology';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Innovate' FROM TempTechnology;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Innovative cities' FROM TempTechnology;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Work Transformed' FROM TempTechnology;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Mission: Ahead' FROM TempTechnology;

DROP TEMPORARY TABLE TempTechnology;

-- Danh mục con của 'Education'
CREATE TEMPORARY TABLE TempEducation AS
SELECT CatID FROM Category WHERE CatName = 'Education';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Admission' FROM TempEducation;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Study Abroad' FROM TempEducation;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'English' FROM TempEducation;

DROP TEMPORARY TABLE TempEducation;

-- Danh mục con của 'Law'
CREATE TEMPORARY TABLE TempLaw AS
SELECT CatID FROM Category WHERE CatName = 'Law';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Case Files' FROM TempLaw;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Consulting' FROM TempLaw;

DROP TEMPORARY TABLE TempLaw;

-- Danh mục con của 'Lifestyle'
CREATE TEMPORARY TABLE TempLifestyle AS
SELECT CatID FROM Category WHERE CatName = 'Lifestyle';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Home' FROM TempLifestyle;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Life Lessons' FROM TempLifestyle;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Cooking' FROM TempLifestyle;

DROP TEMPORARY TABLE TempLifestyle;

-- Danh mục con của 'Travel'
DROP TEMPORARY TABLE IF EXISTS TempTravel;

CREATE TEMPORARY TABLE TempTravel AS
SELECT CatID FROM Category WHERE CatName = 'Travel';

INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Destination' FROM TempTravel;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Cuisine' FROM TempTravel;
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Footprints' FROM TempTravel;
-- Renaming 'Consulting' to 'Travel Consulting' to avoid duplication
INSERT INTO Category (CatParentID, CatName)
SELECT CatID, 'Travel Consulting' FROM TempTravel;

DROP TEMPORARY TABLE TempTravel;


-- NewsTag table

CREATE TABLE NewsTag (
    NewsID INT NOT NULL,
    TagID INT NOT NULL,
    PRIMARY KEY (NewsID, TagID),
    FOREIGN KEY (NewsID) REFERENCES News(NewsID),
    FOREIGN KEY (TagID) REFERENCES Tag(TagID)
);

-- Comment table

CREATE TABLE Comment (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ReaderName VARCHAR(255),
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Content TEXT NOT NULL,
    NewsID INT NOT NULL,
    FOREIGN KEY (NewsID) REFERENCES News(NewsID)
);