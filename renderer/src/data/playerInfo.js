/**
 * ChessGrandmaster 2026 - Player Information
 * Biographical data and images sourced from Wikipedia (public domain)
 */

export const PLAYERS = {
  fischer: {
    id: "fischer",
    name: "Bobby Fischer",
    fullName: "Robert James Fischer",
    born: "March 9, 1943",
    died: "January 17, 2008",
    birthPlace: "Chicago, Illinois, USA",
    deathPlace: "Reykjavík, Iceland",
    nationality: "American",
    titles: ["World Champion (1972-1975)", "Grandmaster (1958)"],
    peakRating: 2785,
    worldChampion: "1972-1975",
    
    // Wikipedia image (public domain)
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Bobby_Fischer_1960_in_Leipzig_in_color.jpg/440px-Bobby_Fischer_1960_in_Leipzig_in_color.jpg",
    imageAlt: "Bobby Fischer in 1960",
    imageCredit: "Wikipedia Commons",
    
    bio: `Bobby Fischer was an American chess grandmaster and the eleventh World Chess Champion. He is widely considered one of the greatest chess players of all time.

Fischer became the youngest grandmaster in history in 1958 at age 15. He won the U.S. Championship eight times, including a perfect 11-0 score in 1963/64.

His 1972 World Championship match against Boris Spassky in Reykjavík, Iceland—dubbed the "Match of the Century"—captivated the world during the Cold War and sparked a chess boom in America.

Fischer's famous "Game of the Century" was played when he was just 13 years old, featuring a stunning queen sacrifice against Donald Byrne.

He authored "My 60 Memorable Games" (1969), considered one of the greatest chess books ever written, and invented Fischer Random Chess (Chess960).`,

    famousGames: [
      "Game of the Century vs Donald Byrne (1956)",
      "World Championship Game 6 vs Spassky (1972)",
      "US Championship perfect 11-0 (1963/64)"
    ],
    
    playingStyle: "Universal player with exceptional opening preparation, endgame technique, and tactical vision. Known for relentless will to win.",
    
    quotes: [
      "Chess demands total concentration.",
      "I don't believe in psychology. I believe in good moves.",
      "All I want to do, ever, is play chess."
    ],
    
    icon: "🦅",
    era: "1943-2008",
    pgnFile: "/pgn/Fischer.pgn",
    totalGames: 827
  },
  
  carlsen: {
    id: "carlsen",
    name: "Magnus Carlsen",
    fullName: "Sven Magnus Øen Carlsen",
    born: "November 30, 1990",
    died: null,
    birthPlace: "Tønsberg, Norway",
    deathPlace: null,
    nationality: "Norwegian",
    titles: [
      "World Champion (2013-2023)",
      "World Rapid Champion (6x)",
      "World Blitz Champion (9x)",
      "Grandmaster (2004)"
    ],
    peakRating: 2882,
    worldChampion: "2013-2023",
    
    // Wikipedia image
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Magnus_Carlsen_Tata_Steel_2013.jpg/440px-Magnus_Carlsen_Tata_Steel_2013.jpg",
    imageAlt: "Magnus Carlsen at Tata Steel 2013",
    imageCredit: "Wikipedia Commons",
    
    bio: `Magnus Carlsen is a Norwegian chess grandmaster widely regarded as one of the greatest players of all time. He holds the record for the highest chess rating ever achieved (2882).

Carlsen became a grandmaster at age 13, making him one of the youngest in history. At 19, he became the youngest player to be ranked world number one.

He won the World Championship in 2013 by defeating Viswanathan Anand and successfully defended his title five times against Anand (2014), Karjakin (2016), Caruana (2018), and Nepomniachtchi (2021).

Known as the "Mozart of Chess," Carlsen excels in all phases of the game but is particularly renowned for his exceptional endgame technique and ability to win seemingly drawn positions.

In 2022, he chose not to defend his World Championship title, citing lack of motivation, but continues to dominate rapid and blitz chess.`,

    famousGames: [
      "World Championship Game 9 vs Anand (2013)",
      "125-game unbeaten streak (2018-2020)",
      "World Championship Game 6 vs Nepomniachtchi (2021)"
    ],
    
    playingStyle: "Universal player combining Karpov's positional mastery with Fischer's fighting spirit. Exceptional endgame technique and grinding ability.",
    
    quotes: [
      "I am trying to beat the guy sitting across from me and trying to choose the moves that are most unpleasant for him and his style.",
      "Some people think that if their opponent plays a beautiful game, it's okay to lose. I don't.",
      "Without the element of enjoyment, it is not worth trying to excel at anything."
    ],
    
    icon: "🧊",
    era: "1990-",
    pgnFile: "/pgn/carlsen.pgn",
    totalGames: 6615
  },
  
  morphy: {
    id: "morphy",
    name: "Paul Morphy",
    fullName: "Paul Charles Morphy",
    born: "June 22, 1837",
    died: "July 10, 1884",
    birthPlace: "New Orleans, Louisiana, USA",
    deathPlace: "New Orleans, Louisiana, USA",
    nationality: "American",
    titles: ["Unofficial World Champion (1858-1859)"],
    peakRating: null, // No rating system existed
    worldChampion: "1858-1859 (unofficial)",
    
    // Wikipedia image (public domain - 19th century)
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Paul_Morphy.jpg/440px-Paul_Morphy.jpg",
    imageAlt: "Paul Morphy portrait",
    imageCredit: "Wikipedia Commons (Public Domain)",
    
    bio: `Paul Morphy was an American chess player who dominated chess in the late 1850s. He is considered by many to be the greatest chess genius of all time and the first unofficial World Champion.

A child prodigy, Morphy learned chess by watching his family play and defeated Hungarian master Johann Löwenthal at age 12.

In 1857, he won the First American Chess Congress convincingly. He then traveled to Europe in 1858, defeating every strong player including Adolf Anderssen (considered the world's best) by large margins.

His most famous game, "The Opera Game" (1858), played against the Duke of Brunswick and Count Isouard at the Paris Opera, is considered the greatest chess game ever played and a perfect demonstration of rapid development.

Morphy retired from serious chess in 1859 at just 22 years old. His strategic principles—rapid development, open files, and piece coordination—were far ahead of his time and form the foundation of modern chess.

He is known as "The Pride and Sorrow of Chess" for his brilliant but tragically brief career.`,

    famousGames: [
      "The Opera Game vs Duke of Brunswick (1858)",
      "vs Louis Paulsen - Queen sacrifice (1857)",
      "vs Adolf Anderssen - Match victory (1858)"
    ],
    
    playingStyle: "Attacking genius who pioneered rapid piece development and open game principles. Combined tactical brilliance with positional understanding decades ahead of his time.",
    
    quotes: [
      "Help your pieces so they can help you.",
      "The ability to play chess is the sign of a gentleman. The ability to play chess well is the sign of a wasted life."
    ],
    
    icon: "👑",
    era: "1837-1884",
    pgnFile: "/pgn/morphy.pgn",
    totalGames: 400
  },
  
  kasparov: {
    id: "kasparov",
    name: "Garry Kasparov",
    fullName: "Garry Kimovich Kasparov",
    born: "April 13, 1963",
    died: null,
    birthPlace: "Baku, Azerbaijan SSR, Soviet Union",
    deathPlace: null,
    nationality: "Russian",
    titles: [
      "World Champion (1985-2000)",
      "Grandmaster (1980)"
    ],
    peakRating: 2851,
    worldChampion: "1985-2000",
    
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kasparov-34.jpg/440px-Kasparov-34.jpg",
    imageAlt: "Garry Kasparov",
    imageCredit: "Wikipedia Commons",
    
    bio: `Garry Kasparov is a Russian chess grandmaster, former World Chess Champion, writer, and political activist. He is widely considered to be the greatest chess player of all time.

Kasparov became the youngest ever undisputed World Chess Champion in 1985 at age 22 by defeating Anatoly Karpov. Their rivalry produced five world championship matches.

He held the world number one ranking for 255 months (over 21 years), the longest in chess history.

In 1997, he famously lost a match to IBM's Deep Blue computer, marking a pivotal moment in AI history.

Known for his aggressive attacking style, exceptional preparation, and psychological warfare, Kasparov revolutionized opening theory and professional chess training.`,

    famousGames: [
      "Kasparov's Immortal vs Topalov (1999)",
      "World Championship Game 16 vs Karpov (1985)",
      "vs Deep Blue Game 1 (1996)"
    ],
    
    playingStyle: "Aggressive, dynamic player with exceptional opening preparation and attacking skills. Known for psychological warfare and competitive intensity.",
    
    quotes: [
      "Chess is mental torture.",
      "Losing can persuade you to change what doesn't need to be changed.",
      "I started playing chess when I was six years old."
    ],
    
    icon: "🔥",
    era: "1963-",
    pgnFile: null,
    totalGames: null
  },
  
  tal: {
    id: "tal",
    name: "Mikhail Tal",
    fullName: "Mikhail Nekhemyevich Tal",
    born: "November 9, 1936",
    died: "June 28, 1992",
    birthPlace: "Riga, Latvia",
    deathPlace: "Moscow, Russia",
    nationality: "Latvian/Soviet",
    titles: [
      "World Champion (1960-1961)",
      "Grandmaster (1957)"
    ],
    peakRating: 2705,
    worldChampion: "1960-1961",
    
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Mikhail_Tal_1982.jpg/440px-Mikhail_Tal_1982.jpg",
    imageAlt: "Mikhail Tal in 1982",
    imageCredit: "Wikipedia Commons",
    
    bio: `Mikhail Tal, known as "The Magician from Riga," was a Soviet Latvian chess grandmaster and the eighth World Chess Champion.

Famous for his creative, aggressive, and tactical style of play, Tal's attacking games are considered among the most beautiful in chess history.

He became World Champion in 1960 by defeating Mikhail Botvinnik, becoming the youngest world champion at that time. Though he lost the rematch in 1961, he remained one of the world's top players for decades.

Despite chronic health issues, Tal won six Soviet Championships and numerous international tournaments. His 95-game unbeaten streak (1973-1974) stood as a record for decades.

Tal was beloved for his charisma, sportsmanship, and the pure joy he brought to chess. His games are studied for their artistic beauty and tactical complexity.`,

    famousGames: [
      "Tal vs Larsen - Candidates 1965",
      "Tal vs Smyslov - Candidates 1959",
      "Tal's Attack vs Botvinnik WC 1960"
    ],
    
    playingStyle: "Brilliant attacking player known for spectacular sacrifices and complex tactical combinations. Called 'The Magician from Riga' for his seemingly impossible victories.",
    
    quotes: [
      "You must take your opponent into a deep dark forest where 2+2=5, and the path leading out is only wide enough for one.",
      "There are two types of sacrifices: correct ones and mine.",
      "Later, I began to succeed in decisive games. Perhaps because I realized a simple truth: not only was I worried, but also my opponent."
    ],
    
    icon: "🔮",
    era: "1936-1992",
    pgnFile: null,
    totalGames: null
  },
  
  anand: {
    id: "anand",
    name: "Viswanathan Anand",
    fullName: "Viswanathan Anand",
    born: "December 11, 1969",
    died: null,
    birthPlace: "Chennai, India",
    deathPlace: null,
    nationality: "Indian",
    titles: [
      "World Champion (2007-2013)",
      "Grandmaster (1988)"
    ],
    peakRating: 2817,
    worldChampion: "2007-2013",
    
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Viswanathan_Anand_08_14_2005.jpg/440px-Viswanathan_Anand_08_14_2005.jpg",
    imageAlt: "Viswanathan Anand",
    imageCredit: "Wikipedia Commons",
    
    bio: `Viswanathan Anand, known as "Vishy" and the "Tiger of Madras," is an Indian chess grandmaster and former World Chess Champion.

Anand became India's first grandmaster in 1988 and has been instrumental in popularizing chess in India, inspiring a generation of Indian chess players.

He won the World Championship multiple times in different formats: FIDE knockout (2000), tournament (2007), and matches against Kramnik (2008), Topalov (2010), and Gelfand (2012).

Known for his lightning-fast intuition and exceptional speed in both calculation and physical play, Anand is considered one of the greatest rapid chess players ever.

His friendly demeanor and sportsmanship have made him one of the most beloved figures in chess history.`,

    famousGames: [
      "vs Kramnik WC 2008 Game 3",
      "vs Kasparov PCA 1995",
      "vs Carlsen WC 2013"
    ],
    
    playingStyle: "Fast, intuitive player with excellent tactical vision and opening preparation. Known for speed of play and adaptability.",
    
    quotes: [
      "In chess, knowledge is a very transient thing. It changes so fast that even a single game can change the theory.",
      "I try to play for the initiative, to attack.",
      "Some sacrifices are sound; the rest are mine."
    ],
    
    icon: "🐅",
    era: "1969-",
    pgnFile: null,
    totalGames: null
  },
  
  kramnik: {
    id: "kramnik",
    name: "Vladimir Kramnik",
    fullName: "Vladimir Borisovich Kramnik",
    born: "June 25, 1975",
    died: null,
    birthPlace: "Tuapse, Russia",
    deathPlace: null,
    nationality: "Russian",
    titles: [
      "World Champion (2000-2007)",
      "Grandmaster (1991)"
    ],
    peakRating: 2817,
    worldChampion: "2000-2007",
    
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Vladimir_Kramnik_2_%28cropped%29.jpg/440px-Vladimir_Kramnik_2_%28cropped%29.jpg",
    imageAlt: "Vladimir Kramnik",
    imageCredit: "Wikipedia Commons",
    
    bio: `Vladimir Kramnik is a Russian chess grandmaster who was the Classical World Chess Champion from 2000 to 2006 and the undisputed World Champion from 2006 to 2007.

Kramnik defeated Garry Kasparov in the 2000 World Championship match, ending Kasparov's 15-year reign. It was one of the biggest upsets in chess history.

Known for his deep positional understanding and exceptional endgame technique, Kramnik was nicknamed "the Drawmaster" for his ability to neutralize opponents' advantages.

He pioneered the Berlin Defense against the Ruy Lopez, making it a respectable weapon at the highest level.

Kramnik retired from professional chess in 2019 after a distinguished career spanning nearly three decades at the world elite level.`,

    famousGames: [
      "vs Kasparov WC 2000 Game 2 - Berlin Wall",
      "vs Topalov WC 2006",
      "vs Deep Fritz 2006"
    ],
    
    playingStyle: "Positional mastermind with exceptional endgame technique. Known for deep preparation and solid, grinding style.",
    
    quotes: [
      "Chess is not for timid souls.",
      "I think it's almost impossible to play with the computer and not lose.",
      "My style is somewhere between that of Tal and Petrosian."
    ],
    
    icon: "🏰",
    era: "1975-",
    pgnFile: null,
    totalGames: null
  },
  
  capablanca: {
    id: "capablanca",
    name: "José Capablanca",
    fullName: "José Raúl Capablanca y Graupera",
    born: "November 19, 1888",
    died: "March 8, 1942",
    birthPlace: "Havana, Cuba",
    deathPlace: "New York City, USA",
    nationality: "Cuban",
    titles: [
      "World Champion (1921-1927)",
      "Grandmaster"
    ],
    peakRating: null,
    worldChampion: "1921-1927",
    
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/JR_Capablanca_and_E_Lasker_1925.jpg/440px-JR_Capablanca_and_E_Lasker_1925.jpg",
    imageAlt: "José Capablanca",
    imageCredit: "Wikipedia Commons (Public Domain)",
    
    bio: `José Raúl Capablanca was a Cuban chess player who was World Chess Champion from 1921 to 1927. He is considered one of the greatest players of all time.

A child prodigy, Capablanca learned chess at age 4 by watching his father play. He was largely self-taught and relied on natural talent rather than extensive study.

His playing style was characterized by exceptional clarity, simplicity, and technical perfection. He made difficult positions look easy.

Capablanca lost only 34 serious games in his entire career and went undefeated from 1916 to 1924, a period of eight years.

Known as the "Human Chess Machine" for his seemingly effortless play and near-perfect technique.`,

    famousGames: [
      "vs Marshall 1918 - Marshall Attack refutation",
      "vs Lasker WC 1921",
      "vs Tartakower 1924"
    ],
    
    playingStyle: "Pure technique and clarity. Made complex positions look simple. Exceptional endgame mastery with minimal effort.",
    
    quotes: [
      "A good player is always lucky.",
      "Chess books should be used as we use glasses: to assist the sight.",
      "In order to improve your game, you must study the endgame before everything else."
    ],
    
    icon: "💎",
    era: "1888-1942",
    pgnFile: null,
    totalGames: null
  },
  
  karpov: {
    id: "karpov",
    name: "Anatoly Karpov",
    fullName: "Anatoly Yevgenyevich Karpov",
    born: "May 23, 1951",
    died: null,
    birthPlace: "Zlatoust, Soviet Union",
    deathPlace: null,
    nationality: "Russian",
    titles: [
      "World Champion (1975-1985)",
      "FIDE World Champion (1993-1999)",
      "Grandmaster (1970)"
    ],
    peakRating: 2780,
    worldChampion: "1975-1985, 1993-1999",
    
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Karpov%2C_Pair_rapid_2009-1.jpg/440px-Karpov%2C_Pair_rapid_2009-1.jpg",
    imageAlt: "Anatoly Karpov",
    imageCredit: "Wikipedia Commons",
    
    bio: `Anatoly Karpov is a Russian chess grandmaster and former World Chess Champion. He was the official world champion from 1975 to 1985 and FIDE World Champion from 1993 to 1999.

Karpov became World Champion in 1975 by default when Bobby Fischer refused to defend his title. He then dominated the chess world for a decade.

His legendary rivalry with Garry Kasparov produced five World Championship matches and some of the most dramatic moments in chess history.

Known for his "boa constrictor" style - slowly squeezing opponents with small advantages until they cracked. His positional mastery is considered among the best ever.

Karpov has won more tournaments and games than any other player in chess history.`,

    famousGames: [
      "vs Kasparov WC 1985 Game 16",
      "vs Kasparov WC 1987 Seville",
      "vs Spassky Candidates 1974"
    ],
    
    playingStyle: "Boa constrictor style - patient, positional play that slowly suffocates opponents. Master of prophylaxis and small advantages.",
    
    quotes: [
      "Style? I have no style.",
      "The most important thing in chess is to learn to wait.",
      "Chess is everything: art, science, and sport."
    ],
    
    icon: "🐍",
    era: "1951-",
    pgnFile: null,
    totalGames: null
  }
};

// Get player by ID
export function getPlayer(playerId) {
  return PLAYERS[playerId] || null;
}

// Get all players
export function getAllPlayers() {
  return Object.values(PLAYERS);
}

// Get players with PGN files
export function getPlayersWithPGN() {
  return Object.values(PLAYERS).filter(p => p.pgnFile);
}

// Search players
export function searchPlayers(query) {
  const q = query.toLowerCase();
  return Object.values(PLAYERS).filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.fullName.toLowerCase().includes(q) ||
    p.nationality.toLowerCase().includes(q)
  );
}
