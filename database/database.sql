CREATE TABLE uzytkownicy (
	uz_id       serial NOT NULL,
	uz_login    varchar(254),
	uz_haslo    varchar(254) NOT NULL,
	uz_email    varchar(254) NOT NULL,
	uz_nazwisko varchar(50),
	uz_imie     varchar(50),
	PRIMARY KEY (uz_id)
);
CREATE UNIQUE INDEX uzytkownicy_idx_001 ON uzytkownicy(uz_email);

CREATE TABLE kategorie (
	kat_id    serial NOT NULL,
	kat_nazwa varchar(100) NOT NULL,
	PRIMARY KEY (kat_id)
);

CREATE TABLE towary (
	t_id     serial NOT NULL,
	t_nazwa  varchar(200) NOT NULL,
	t_link   varchar(200),
	t_kat_id integer REFERENCES kategorie,
	PRIMARY KEY (t_id)
);
CREATE INDEX towary_001 ON towary(t_kat_id);

CREATE TABLE ceny (
	c_id        serial NOT NULL,
	c_t_id      integer REFERENCES towary,
	c_cena      numeric(16,2) NOT NULL,
	c_jednostka varchar(50) ,
	c_ilosc     numeric(16,2) NOT NULL,
	PRIMARY KEY (c_id)
);
CREATE INDEX ceny_001 ON ceny(c_t_id);

CREATE TABLE koszyk (
	ko_id    serial NOT NULL,
	ko_uz_id integer REFERENCES uzytkownicy,
	ko_c_id  integer REFERENCES ceny,
	ko_ile   numeric,
	PRIMARY KEY (ko_id)
);
CREATE INDEX koszyk_idx_001 ON koszyk(ko_uz_id);
CREATE INDEX koszyk_idx_002 ON koszyk(ko_c_id);

CREATE TABLE zamowienia_statusy (
	zas_id    serial NOT NULL,
	zas_nazwa varchar(50),
	PRIMARY KEY (zas_id)
);

CREATE TABLE zamowienia (
	zam_id     serial NOT NULL,
	zam_uz_id  integer REFERENCES uzytkownicy,
	zam_dpowst timestamp DEFAULT current_timestamp,
	zam_zas_id integer REFERENCES zamowienia_statusy,
	PRIMARY KEY (zam_id)
);
CREATE INDEX zamowienia_idx_001 ON zamowienia(zam_uz_id);
CREATE INDEX zamowienia_idx_002 ON zamowienia(zam_zas_id);

CREATE TABLE zamowienia_pozycje (
	zap_id     serial NOT NULL,
	zap_zam_id integer REFERENCES zamowienia,
	zap_c_id   integer REFERENCES ceny,
	zap_ile    numeric,
	PRIMARY KEY (zap_id)
);
CREATE INDEX zamowienia_pozycje_idx_001 ON zamowienia_pozycje(zap_zam_id);
CREATE INDEX zamowienia_pozycje_idx_002 ON zamowienia_pozycje(zap_c_id);
