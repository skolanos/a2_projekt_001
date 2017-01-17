CREATE TABLE uzytkownicy (
	uz_id serial NOT NULL,
	uz_login character varying(255),
	uz_haslo character varying(255),
	uz_email character varying(254),
	uz_nazwisko character varying(50),
	uz_imie character varying(50),
	PRIMARY KEY (uz_id)
);
CREATE UNIQUE INDEX uzytkownicy_idx_001 ON uzytkownicy(uz_email);
