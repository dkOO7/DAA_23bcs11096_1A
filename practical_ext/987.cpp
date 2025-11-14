/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
class Solution {
public:
    void dfs(TreeNode* root , int r , int c,
     map<int, map<int,priority_queue<int , vector<int> ,greater<int>>>>&mp){
        if(!root)return ;
        mp[c][r].push(root->val);
        dfs(root->left,r+1,c-1 ,mp);
        dfs(root->right , r+1,c+1,mp);
    }
    vector<vector<int>> verticalTraversal(TreeNode* root) {
        map<int, map<int,priority_queue<int , vector<int> ,greater<int>>>>mp;
        dfs(root,0,0,mp);
        vector<vector<int>> res(mp.size());
        int k =0;
        for(auto it: mp){
            for(auto it2: it.second){
                while(!it2.second.empty()){
                    res[k].push_back(it2.second.top());
                    it2.second.pop();
                }
            }
            k++;
        }
        return res;
    }
};
