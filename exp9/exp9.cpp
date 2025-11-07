class Solution {
  public:
    vector<int> rabinKarp(string &text, string &pattern) {
        int n = text.size();
        int m = pattern.size();
        vector<int> result;

        if (m > n) return result;

        long long prime = 31;
        long long mod = 1e9 + 7;

        long long patternHash = 0;
        long long windowHash = 0;
        long long power = 1;

        for (int i = 0; i < m - 1; i++)
            power = (power * prime) % mod;

        for (int i = 0; i < m; i++) {
            patternHash = (patternHash * prime + pattern[i]) % mod;
            windowHash  = (windowHash  * prime + text[i])     % mod;
        }

        for (int i = 0; i <= n - m; i++) {

            if (patternHash == windowHash) {
                if (text.substr(i, m) == pattern)
                    result.push_back(i);
            }

            if (i < n - m) {
                windowHash = (windowHash - (text[i] * power) % mod + mod) % mod;
                windowHash = (windowHash * prime + text[i + m]) % mod;
            }
        }

        return result;
    }
};
