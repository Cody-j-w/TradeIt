export function zipRadiusLookup(zip: string): string[] {
    const map: { [key: string]: string[] } = {
      '74104': ['74104', '74103', '74105', '74106', '74114', '74119'],
      '74105': ['74105', '74104', '74114', '74136', '74119'],
      '74106': ['74106', '74104', '74103'],
      // Add more mappings as needed
    };
  
    return map[zip] || [zip];
  }
  