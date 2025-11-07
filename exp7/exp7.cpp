class Solution {
  public:
    int solve(int i, int cw , vector<int>& val ,
    vector<int>& wt, vector<vector<int>>& dp){
        if(cw==0)return 0;
        if(i== val.size())return 0;
        if(dp[i][cw] != -1)return dp[i][cw];

        int a = 0;
        if(wt[i] <=cw) a = val[i]+ solve(i+1, cw- wt[i], val,wt,dp);
        int b = solve(i+1,  cw ,val ,wt,dp);

        return dp[i][cw] = max(a,b);
    }
    int knapsack(int W, vector<int> &val, vector<int> &wt) {
        // code here
        int n = val.size();
        vector<vector<int>> dp(n+1, vector<int>(W+1,-1));
        return solve(0,W,val , wt, dp);
    }
};
