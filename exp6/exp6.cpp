class Solution {
  public:
    bool solve(int i ,int cur, int sum , vector<vector<int>>& dp , vector<int>& nums){
        int n = nums.size();
        if(sum ==  cur )return true;
        if(i==n)return false;
        if(dp[i][cur] != -1)return dp[i][cur];
        bool p= false;
        if(cur+ nums[i]<=sum) p = solve(i+1,cur+nums[i],sum,dp,nums);
        bool np = solve(i+1, cur, sum, dp ,nums);
        return dp[i][cur] = p ||np;
    }
    bool isSubsetSum(vector<int>& arr, int sum) {
        // code here
        int n = arr.size();
        vector<vector<int>>dp(n,vector<int>(sum+1,-1));
        return solve(0,0,sum,dp,arr);
    }
};
