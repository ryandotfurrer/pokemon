import Image from 'next/image';

interface PokemonStat {
  stat: {
    name: string;
  };
  base_stat: number;
}

interface PokemonType {
  type: {
    name: string;
  };
}

async function getPokemon(name: string) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    // Add cache settings
    cache: 'force-cache',
    // Ensure we're getting fresh data
    next: {
      revalidate: 3600, // revalidate every hour
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch pokemon: ${name}`);
  }

  return res.json();
}

// Add error boundary
export async function generateMetadata({
  params,
}: {
  params: { name: string };
}) {
  return {
    title: `Pokemon - ${params.name}`,
  };
}

// Add error handling
export default async function PokemonPage({
  params,
}: {
  params: { name: string };
}) {
  try {
    const pokemon = await getPokemon(params.name.toLowerCase()); // ensure lowercase

    return (
      <div className='p-4 max-w-xl mx-auto'>
        <Image
          src={pokemon.sprites.front_default}
          alt={pokemon.name}
          width={192}
          height={192}
          className='mx-auto w-48 h-48'
        />

        <h1 className='text-2xl font-bold text-center capitalize mb-4'>
          {pokemon.name}
        </h1>

        <div className='grid grid-cols-2 gap-4'>
          <div className='border rounded p-4'>
            <h2 className='font-bold mb-2'>Stats</h2>
            {pokemon.stats.map((stat: PokemonStat) => (
              <div
                key={stat.stat.name}
                className='flex justify-between'
              >
                <span className='capitalize'>{stat.stat.name}:</span>
                <span>{stat.base_stat}</span>
              </div>
            ))}
          </div>

          <div className='border rounded p-4'>
            <h2 className='font-bold mb-2'>Types</h2>
            {pokemon.types.map((type: PokemonType) => (
              <span
                key={type.type.name}
                className='inline-block px-2 py-1 bg-gray-200 rounded mr-2 capitalize'
              >
                {type.type.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  } catch (err) {
    return (
      <div className='p-4 text-center'>
        <h1 className='text-2xl font-bold text-red-500'>Pokemon not found!</h1>
        <p>Could not find pokemon: {params.name}</p>
        <pre>{JSON.stringify(err, null, 2)}</pre>
      </div>
    );
  }
}
