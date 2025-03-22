'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface Pokemon {
  name: string;
  url: string;
  id: number;
}

export default function PokemonSearch() {
  const [search, setSearch] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  const searchPokemon = async (query: string) => {
    if (!query) return setPokemon([]);

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
    const data = await res.json();

    const filtered = data.results
      .map((p: Pokemon, index: number) => ({
        ...p,
        id: index + 1,
      }))
      .filter((p: Pokemon) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      );

    setPokemon(filtered);
  };

  return (
    <main className='p-4 max-w-3xl mx-auto'>
      <input
        type='text'
        placeholder='Search Pokemon...'
        className='w-full p-2 border rounded'
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          searchPokemon(e.target.value);
        }}
      />

      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
        {pokemon.map((p) => (
          <Link
            href={`/pokemon/${p.name}`}
            key={p.name}
            className='p-4 border rounded hover:bg-gray-50'
          >
            <Image
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
              className='mx-auto'
              width={192}
              height={192}
            />
            <p className='text-center capitalize mt-2'>{p.name}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
