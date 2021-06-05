--
-- PostgreSQL database dump
--

-- Dumped from database version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)
-- Dumped by pg_dump version 10.12 (Ubuntu 10.12-0ubuntu0.18.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


ALTER TABLE ONLY public.posts DROP CONSTRAINT "fk_userId_posts";
ALTER TABLE ONLY public.chat DROP CONSTRAINT "fk_userId_chat";
ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
ALTER TABLE ONLY public.users DROP CONSTRAINT unique_username;
ALTER TABLE ONLY public.users DROP CONSTRAINT unique_name;
ALTER TABLE ONLY public.users DROP CONSTRAINT unique_email;
ALTER TABLE ONLY public.posts DROP CONSTRAINT posts_pkey;
ALTER TABLE ONLY public.chat DROP CONSTRAINT chat_pkey;
ALTER TABLE public.users ALTER COLUMN "userId" DROP DEFAULT;
ALTER TABLE public.posts ALTER COLUMN "postId" DROP DEFAULT;
ALTER TABLE public.chat ALTER COLUMN "chatId" DROP DEFAULT;
DROP SEQUENCE public."users_userId_seq";
DROP TABLE public.users;
DROP SEQUENCE public."posts_postId_seq";
DROP TABLE public.posts;
DROP SEQUENCE public."chat_chatId_seq";
DROP TABLE public.chat;
DROP EXTENSION plpgsql;
DROP SCHEMA public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: chat; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.chat (
    "chatId" integer NOT NULL,
    "userId" integer,
    username text,
    message text,
    "timeSent" timestamp without time zone DEFAULT now()
);


--
-- Name: chat_chatId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."chat_chatId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: chat_chatId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."chat_chatId_seq" OWNED BY public.chat."chatId";


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    "postId" integer NOT NULL,
    "userId" integer,
    subject text,
    content text,
    "datePosted" timestamp without time zone DEFAULT now(),
    "dateUpdated" timestamp without time zone DEFAULT now()
);


--
-- Name: posts_postId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."posts_postId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_postId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."posts_postId_seq" OWNED BY public.posts."postId";


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    "userId" integer NOT NULL,
    name text,
    password text,
    username text,
    email text,
    zipcode integer,
    phone text,
    "profileImage" text,
    genre1 text,
    genre2 text,
    genre3 text,
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),     
    "resetPasswordToken" text,
    "resetPasswordExpires" text   
);


--
-- Name: users_userId_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."users_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."users_userId_seq" OWNED BY public.users."userId";


--
-- Name: chat chatId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat ALTER COLUMN "chatId" SET DEFAULT nextval('public."chat_chatId_seq"'::regclass);


--
-- Name: posts postId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN "postId" SET DEFAULT nextval('public."posts_postId_seq"'::regclass);


--
-- Name: users userId; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN "userId" SET DEFAULT nextval('public."users_userId_seq"'::regclass);


--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.chat ("chatId", "userId", username, message, "timeSent") FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.posts ("postId", "userId", subject, content, "datePosted", "dateUpdated") FROM stdin;
1	1	Just saw Bodom in concert	I saw an awesome concert today with Children of Bodom. They definitely put on a good show. I highly recommend seeing them live because Alexi is an other-worldly guitarist!!	2020-01-01 00:00:00	\N
2	2	Used guitar for sale?	Does anyone have a used Fender Stratocaster they would like to sell? I am taking guitar lessons starting next month and am in dire need of one to practice on. I am willing to pay good money, too!	2020-03-15 00:00:00	\N
3	3	Movie review for Lords of Chaos	Just saw the movie Lords of Chaos which was based on the book of the same name and it was honestly pretty good. The acting was spot on and the historical accuracy was also good for the most part.	2020-02-04 00:00:00	\N
4	4	Who wants to see Taake?	Norwegian black metal band Taake is coming to town here in San Diego next weekend and I heard they put on an epic show. Who wants to go?	2020-03-19 00:00:00	\N
5	5	Any good metal magazines?	Can anyone recommend any good publications on metal, preferrably magazines? The reason is I am going on a long flight in a couple of days and would like some good reading material. Thanks.	2019-04-27 00:00:00	\N
6	6	Poll: Who is the best metal drummer?	I would like to know your guys opinion on who you think is the best metal drummer. I personally would give the nod to Dave Lombardo of Slayer for pioneering the double bass pedals. Polls now open!	2019-06-20 00:00:00	\N
7	7	Metalheads in Orange County	I am moving soon to Orange County and wanna see if there are any metalheads in the area. It would be cool to meet up with like-minded people and possibly get a tour of the area, thanks in advance.	2019-08-12 00:00:00	\N
8	8	Iron Maiden vs. Ozzy feud	Has anyone heard of the long-standing feud between Maiden and Ozzy? It started way back years ago at Ozzfest in Southern California when Ozzy pulled the plug on Maiden's set. I was just wondering if they finally buried the hatchet or not?	2020-05-02 00:00:00	\N
9	9	Glam metal is the worst sub-genre	Out of all the genres in metal, I think glam metal has got to be the worst. It's all flash and no substance. Technically their music is not that impressive at all. The guitar solos are lacking and the drumming sounds like it belongs to the realm of soft rock instead.	2019-12-25 00:00:00	\N
10	10	Classical music and metal	I grew up listening to classical music as a kid (I played the piano) and discovered metal quite late. But after sampling some metal bands, I can definitely hear the classical music influence in many metal songs. If Bach picked up a guitar, he would have played metal for sure!!!	2019-11-26 00:00:00	\N
11	11	Bruce Dickenson has a pilot license	I just found out that the lead singer for Iron Maiden is a licensed pilot, and that he flew the entire band in a Boeing 747 for one of their world tours a number of years ago. Man, talk about talented!	2019-07-04 00:00:00	\N
12	12	Swedish metal invasion!	Check out this lineup: Arch Enemy, Amon Amarth, and At The Gates! This all-Swedish lineup will be playing in Hollywood in 2 weeks. Get your tickets now!	2019-10-30 00:00:00	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users ("userId", name, password, username, email, zipcode, phone, "profileImage", genre1, genre2, genre3, "createdAt", "updatedAt", "resetPasswordToken", "resetPasswordExpires") FROM stdin;
1	Buhlake RossLyn	1234	1337Dragonforce	guitarheroexpert@gmail.com	92609	949-262-1337	/images/profileImages/serveimage-1585007105091-1585008406705.jfif	Power Metal	Groove Metal	Glam Metal	2020-03-09 19:35:39.508588	\N	\N	\N
2	Alexi Laiho	1234	ChildrenOfBodom	alexi@bodom.net	10003	212-998-1113	\N	Black Metal	Thrash Metal	Doom Metal	2020-03-09 19:35:39.508588	\N	\N	\N
3	Yngvie Malmsteen	1234	SymphonyX	yngvie@metal.com	11222	917-663-1123	\N	Symphonic Metal	Folk Metal	Speed Metal	2020-03-09 19:35:39.508588	\N	\N	\N
4	Dave Mustaine	1234	Megadeth	dave@megadeth.org	90210	310-355-2353	\N	Thrash Metal	Speed Metal	Heavy Metal	2020-03-09 19:35:39.508588	\N	\N	\N
5	Lars Ulrich	1234	Metallica	lars@metallica.net	91714	310-345-2567	\N	Heavy Metal	Thrash Metal	Speed Metal	2020-03-09 19:35:39.508588	\N	\N	\N
6	Hansi Kursch	1234	BlindGuardian	hansi@blindguardian.com	71423	342-223-9050	\N	Power Metal	Symphonic Metal	Black Metal	2020-03-09 19:35:39.508588	\N	\N	\N
7	Varg Vikernes	1234	Burzum	varg@burzum.net	61232	214-246-6432	\N	Black Metal	Death Metal	Doom Metal	2020-03-09 19:35:39.508588	\N	\N	\N
8	Gaal Jorgensen	1234	Mayhem	gaal@mayhem.com	23233	944-323-3255	\N	Black Metal	Doom Metal	Pagan Metal	2020-03-09 19:35:39.508588	\N	\N	\N
9	Axl Bloomberg	1234	Satyricon	axl@satyricon.org	53133	949-323-3599	\N	Black Metal	Deathcore	Grindcore	2020-03-09 19:35:39.508588	\N	\N	\N
10	James Hetfield	1234	DeathAngel	james@deathangel.org	92333	352-835-2335	\N	Heavy Metal	Groove Metal	Viking Metal	2020-03-09 19:35:39.508588	\N	\N	\N
11	Morty Smith	1234	Mortison	morty@mortison.com	32353	422-235-3252	\N	Sludge Metal	Progressive Metal	Pagan Metal	2020-03-09 19:35:39.508588	\N	\N	\N
12	Rick Sanchez	1234	RicksyBusiness	rick@sanchez.net	83445	534-235-1456	\N	Symphonic Metal	Viking Metal	Deathcore	2020-03-09 19:35:39.508588	\N	\N	\N
13	Beth Smith	1234	Bethesda	beth@bethesda.net	74345	334-342-3462	\N	Pirate Metal	Pagan Metal	Death Metal	2020-03-09 19:35:39.508588	\N	\N	\N
14	Joe Johnson	$2b$10$jWGrMgX8BZMstl7RssuhOu0du/mzTIahR9TzqCDUmB9w3ulT0/mNy	jcacct	jcacct@gmail.com	92870	132-456-8789	\N	Black Metal	Blackened Death Metal	Deathcore	2020-03-09 19:35:39.508588	\N	3/24/2020 11:24	3/24/2020 19:38
\.


--
-- Name: chat_chatId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."chat_chatId_seq"', 1, false);


--
-- Name: posts_postId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."posts_postId_seq"', 13, true);


--
-- Name: users_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."users_userId_seq"', 15, true);


--
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY ("chatId");


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY ("postId");


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users unique_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_name UNIQUE (name);


--
-- Name: users unique_username; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_username UNIQUE (username);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("userId");


--
-- Name: chat fk_userId_chat; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT "fk_userId_chat" FOREIGN KEY ("userId") REFERENCES public.users("userId");


--
-- Name: posts fk_userId_posts; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT "fk_userId_posts" FOREIGN KEY ("userId") REFERENCES public.users("userId");


--
-- Name: chat fk_username_chat; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT "fk_username_chat" FOREIGN KEY ("username") REFERENCES public.users("username");


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

