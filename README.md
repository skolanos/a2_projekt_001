# angular2_simple_ordering_app

Serwer w Node.js z wykorzystaniem Express do weryfikacji połączenia wykorzystuje
JsonWebTokens. Jako baza danych wykorzystywana jest baza PostgreSQL. Po stronie
klienta aplikacja w Angular umożliwia rejestrowanie użytkowników i przeglądania
prostej listy z ofertą, umieszczanie produktów w koszyku i rejestrowanie zamówień.

## Konfiguracja bazy danych i utworzenie tabel

Należy utworzyć nową bazę danych w PostgreSQL. Następnie wykonać polecenia zakładające
tabele i indeksy z pliku `/database/database.sql`. Po utworzeniu tabel można
zasilić je przykładowymi danymi z pliku `/database/sample_data.sql`.

W celu określenia adresu bazy danych z którą będzie się komunikował się serwer
należy w pliku `/server/server-config.js` zmodyfikować wartość atrybutu `connectionString`.

## Instalacja pakietów npm

Przed pierwszym uruchomieniem aplikacji konieczne jest pobranie pakietów wymienionych
w pliku `package.json`. W głównym katalogu aplikacji należy wykonać polecenie:

```shell
npm install
cd client
npm install
```

## Uruchomienie aplikacji

W głównym katalogu aplikacji należy wykonać polecenie:

```shell
npm start
```

Następnie w nowym oknie konsoli należy z głównego okna aplikacji wykonać polecenie:

```shell
cd client
npm start
```

W przeglądarce należy przejść do adresu `http://localhost:3000/`.
