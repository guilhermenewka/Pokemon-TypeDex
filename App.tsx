
import React, { useState, useEffect, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { PokemonCard } from './components/PokemonCard';
import { Spinner } from './components/Spinner';
import { getPokemonList, getProcessedPokemonDetails } from './services/pokemonService';
import type { PokemonListItem, ProcessedPokemon } from './types';
import { TypeDexIcon } from './components/TypeDexIcon';

const App: React.FC = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<ProcessedPokemon | null>(null);
  const [isLoadingList, setIsLoadingList] = useState<boolean>(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonList = async () => {
      try {
        setIsLoadingList(true);
        setError(null);
        const pokemonList = await getPokemonList(1500); // Fetch all generations + forms
        setAllPokemon(pokemonList);
      } catch (err) {
        setError('Failed to fetch Pokemon list. Please try again later.');
        console.error(err);
      } finally {
        setIsLoadingList(false);
      }
    };

    fetchPokemonList();
  }, []);

  const handlePokemonSelect = useCallback(async (pokemonName: string) => {
    if (!pokemonName) {
      setSelectedPokemon(null);
      return;
    }
    
    setIsLoadingDetails(true);
    setError(null);
    setSelectedPokemon(null);
    
    try {
      const details = await getProcessedPokemonDetails(pokemonName);
      setSelectedPokemon(details);
    } catch (err) {
      setError(`Failed to fetch details for ${pokemonName}.`);
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center my-6">
          <div className="flex items-center justify-center gap-3">
            <TypeDexIcon />
            <h1 className="text-4xl font-bold text-yellow-400 tracking-tight">
              TypeDex
            </h1>
          </div>
          <p className="text-slate-400 mt-2">Quickly find Pokémon type weaknesses & resistances.</p>
        </header>

        <main>
          <SearchBar
            pokemonList={allPokemon}
            onPokemonSelect={handlePokemonSelect}
            disabled={isLoadingList}
          />

          {isLoadingList && (
            <div className="mt-8 flex flex-col items-center">
              <Spinner />
              <p className="text-slate-400 mt-2">Loading Pokédex...</p>
            </div>
          )}
          
          {error && <p className="text-red-400 text-center mt-4">{error}</p>}
          
          <div className="mt-6">
            {isLoadingDetails && (
              <div className="mt-8 flex flex-col items-center">
                <Spinner />
              </div>
            )}
            {selectedPokemon && !isLoadingDetails && <PokemonCard pokemon={selectedPokemon} />}
            {!selectedPokemon && !isLoadingDetails && !isLoadingList && !error && (
              <div className="text-center text-slate-500 mt-12 p-6 border-2 border-dashed border-slate-700 rounded-lg">
                <p>Search for a Pokémon to see its type effectiveness.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
