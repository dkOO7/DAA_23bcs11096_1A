class Solution {
  public:
    void quickSort(vector<int>& arr, int low, int high) {
        // code here
        if(low<high){
            int p = partition(arr,low,high);
            quickSort(arr,low,p-1);
            quickSort(arr,p+1,high);
        }

    }

  public:
    int partition(vector<int>& arr, int low, int high) {

        // code here
        int pivot = arr[high];
        int i = low -1;
        for(int j = low ;j<high;j++){
            if(arr[j]<= pivot){
                i++;
                swap(arr[i],arr[j]);
            }
        }
        swap(arr[i+1],arr[high]);
        return i+1;
    }
};
