export interface AnimeCharacter {
  id: string;
  name: string;
  originSeries: string;
  description: string;
  imageUrl: string;
  tags: string[];
}

// todo: decide on categories later
export const MOCK_CHARACTERS: AnimeCharacter[] = [
  {
    id: "holo",
    name: "Holo",
    originSeries: "Spice and Wolf",
    description: "The Wise Wolf of Yoitsu, a powerful wolf deity who travels alongside the merchant Lawrence.",
    imageUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400", // Placeholder anime artwork style
    tags: ["Deity", "Kemonomimi", "Witty"]
  },
  {
    id: "kurisumakise",
    name: "Kurisu Makise",
    originSeries: "Steins;Gate",
    description: "A genius neuroscientist who graduated from university at seventeen. Rational, sarcastic, and deeply curious.",
    imageUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400",
    tags: ["Tsundere", "Scientist", "Kuudere"]
  },
  {
    id: "rem",
    name: "Rem",
    originSeries: "Re:Zero",
    description: "A loyal maid working at the Roswaal Mansion alongside her twin sister, Ram. Highly skilled in water magic.",
    imageUrl: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400",
    tags: ["Maid", "Short Hair", "Short-tempered"]
  }
];