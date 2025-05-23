#include<bits/stdc++.h>
using namespace std;

int main(){
    int t;
    cin>>t;
    while(t--){
        int n,m;
        cin>>n>>m;
        vector<vector<int>> v;
        for(int i=0;i<n*m;i++){
            int val;
            cin>>val;
            v.push_back(val);
        }
        cout<<"Printing the matrix\n";
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                cout<<v[i][j]<<" ";
            }
            cout<<enld;
        }
        cout<<endl;
    }
}