module.exports = `


// A single iteration of Bob Jenkins' One-At-A-Time hashing algorithm.
int hash( int x ) {
    x += ( x << 10 );
    x ^= ( x >>  6 );
    x += ( x <<  3 );
    x ^= ( x >> 11 );
    x += ( x << 15 );
    return x;
}



// Compound versions of the hashing algorithm I whipped together.
int hash( vec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
int hash( vec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
int hash( vec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }



// Construct a float with half-open range [0:1] using low 23 bits.
// All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
float floatConstruct( int m ) {
    const int ieeeMantissa = 0x007FFFFF; // binary32 mantissa bitmask
    const int ieeeOne      = 0x3F800000; // 1.0 in IEEE binary32

    m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
    m |= ieeeOne;                          // Add fractional part to 1.0

    float  f = intBitsToFloat( m );       // Range [1:2]
    return f - 1.0;                        // Range [0:1]
}



// Pseudo-random value in half-open range [0:1].
float random( float x ) { return floatConstruct(hash(floatBitsToint(x))); }
float random( vec2  v ) { return floatConstruct(hash(floatBitsToint(v))); }
float random( vec3  v ) { return floatConstruct(hash(floatBitsToint(v))); }
float random( vec4  v ) { return floatConstruct(hash(floatBitsToint(v))); }

`
