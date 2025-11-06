
import type { PokemonListItem, Pokemon, Type, TypeEffectiveness, ProcessedPokemon, Stat, Ability } from '../types';
import { POKEAPI_BASE_URL } from '../constants';

const apiCache = new Map<string, any>();

async function fetchFromApi<T,>(url: string): Promise<T> {
  if (apiCache.has(url)) {
    return apiCache.get(url) as T;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }
  const data = await response.json();
  apiCache.set(url, data);
  return data as T;
}

export async function getPokemonList(limit: number = 151): Promise<PokemonListItem[]> {
  const data = await fetchFromApi<{ results: PokemonListItem[] }>(`${POKEAPI_BASE_URL}/pokemon?limit=${limit}`);
  return data.results;
}

export async function getPokemonDetails(name: string): Promise<Pokemon> {
  return await fetchFromApi<Pokemon>(`${POKEAPI_BASE_URL}/pokemon/${name.toLowerCase()}`);
}

export async function getTypeDetails(url: string): Promise<Type> {
  return await fetchFromApi<Type>(url);
}

export async function getProcessedPokemonDetails(name: string): Promise<ProcessedPokemon> {
  const pokemon = await getPokemonDetails(name);
  const typeUrls = pokemon.types.map(t => t.type.url);
  const typeDetailsPromises = typeUrls.map(url => getTypeDetails(url));
  const typesData = await Promise.all(typeDetailsPromises);

  const effectiveness: TypeEffectiveness = {};

  for (const typeData of typesData) {
    typeData.damage_relations.double_damage_from.forEach(t => {
      effectiveness[t.name] = (effectiveness[t.name] || 1) * 2;
    });
    typeData.damage_relations.half_damage_from.forEach(t => {
      effectiveness[t.name] = (effectiveness[t.name] || 1) * 0.5;
    });
    typeData.damage_relations.no_damage_from.forEach(t => {
      effectiveness[t.name] = (effectiveness[t.name] || 1) * 0;
    });
  }

  const weaknesses: { [key: string]: number } = {};
  const resistances: { [key: string]: number } = {};

  for (const type in effectiveness) {
    const multiplier = effectiveness[type];
    if (multiplier > 1) {
      weaknesses[type] = multiplier;
    } else if (multiplier < 1) {
      resistances[type] = multiplier;
    }
  }

  const stats: Stat[] = pokemon.stats.map(s => ({
    name: s.stat.name
      .replace('special-attack', 'Sp. Atk')
      .replace('special-defense', 'Sp. Def')
      .replace('-', ' '),
    value: s.base_stat,
  })).reverse();

  const abilities: Ability[] = pokemon.abilities.map(a => ({
    name: a.ability.name.replace('-', ' '),
    isHidden: a.is_hidden,
  }));

  return {
    id: pokemon.id,
    name: pokemon.name,
    spriteUrl: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
    types: pokemon.types.map(t => t.type.name),
    weaknesses,
    resistances,
    stats,
    abilities,
  };
}
