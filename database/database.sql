CREATE TABLE uzytkownicy (
	uz_id serial NOT NULL,
	uz_login character varying(255),
	uz_haslo character varying(255) NOT NULL,
	uz_email character varying(254) NOT NULL,
	uz_nazwisko character varying(50),
	uz_imie character varying(50),
	PRIMARY KEY (uz_id)
);
CREATE UNIQUE INDEX uzytkownicy_idx_001 ON uzytkownicy(uz_email);

CREATE TABLE kategorie (
	kat_id serial NOT NULL,
	kat_nazwa varchar(100) NOT NULL,
	PRIMARY KEY (kat_id)
);

CREATE TABLE towary (
	t_id serial NOT NULL,
	t_nazwa varchar(200) NOT NULL,
	t_link varchar(200),
	t_kat_id integer,
	PRIMARY KEY (t_id)
);
