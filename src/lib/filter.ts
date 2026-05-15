export const filterChirp = (chirp: string): string => {
  const bad_words = ["kerfuffle", "sharbert", "fornax"];

  for (const bad_word of bad_words) {
    // if (chirp.includes(bad_word)) {
    //   return chirp.replace(bad_word, "****");
    // }
    chirp = chirp.replace(new RegExp(bad_word, "gi"), "****"); // case-insensitive replacement
  }
  return chirp;
};
