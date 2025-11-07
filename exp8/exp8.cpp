// User Function Template
class Solution {
  public:
    vector<int> dijkstra(int V, vector<vector<int>> &edges, int src) {
        // Code here
        vector<vector<pair<int,int>>> adj(V);
        for(auto i : edges){
            int u = i[0];
             int v = i[1];
             int w = i[2];
             adj[u].push_back({v,w});
             adj[v].push_back({u,w});
        }
        vector<int> dist(V, INT_MAX);
        dist[src]=0;
        priority_queue<pair<int,int>, vector<pair<int,int>> , greater<pair<int,int>>>pq;
        pq.push({0,src});
        while(!pq.empty()){
            auto cd = pq.top().first;
            auto node = pq.top().second;
            pq.pop();
            if(cd> dist[node])continue;
            for(auto i : adj[node]){
                if(dist[node]+i.second <dist[i.first]){
                    dist[i.first]= dist[node]+i.second;
                    pq.push({dist[i.first],i.first});
                }
            }

        }
        return dist;
    }
};
