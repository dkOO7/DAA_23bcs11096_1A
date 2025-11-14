class Solution {
public:
    bool is_valid(int mid , vector<int>& nums, int k ){
        int part =1;
        int res{};
        int n {static_cast<int>(nums.size())};
        for(int i =0;i<n;i++){
            res+=nums[i];
            if(res> mid){
                part++;
                res = nums[i];
            }
        }
        return part<=k;
    }
    int splitArray(vector<int>& nums, int k) {
        int n = nums.size();
        int l = *max_element(nums.begin(),nums.end());
        long long h = accumulate(nums.begin(), nums.end(),0);
        int mid{};
        int ans{INT_MAX};
        while(l<=h){
            mid = l + (h-l)/2;
            if(is_valid(mid,nums, k)){
                ans = mid;
                h = mid-1;
            }
            else{
                l= mid+1;
            }
        }
        return ans;
    }
};
