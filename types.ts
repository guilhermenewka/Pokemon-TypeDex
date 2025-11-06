
export interface PokemonListItem {
  name: string;
  url: string;
}

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
  abilities: {
    ability: { name: string };
    is_hidden: boolean;
  }[];
}

export interface Type {
  name: string;
  damage_relations: {
    double_damage_from: { name: string }[];
    half_damage_from: { name: string }[];
    no_damage_from: { name: string }[];
  };
}

export interface TypeEffectiveness {
  [key: string]: number;
}

export interface Stat {
  name: string;
  value: number;
}

export interface Ability {
  name: string;
  isHidden: boolean;
}

export interface ProcessedPokemon {
  id: number;
  name: string;
  spriteUrl: string;
  types: string[];
  weaknesses: { [key: string]: number };
  resistances: { [key: string]: number };
  stats: Stat[];
  abilities: Ability[];
}
