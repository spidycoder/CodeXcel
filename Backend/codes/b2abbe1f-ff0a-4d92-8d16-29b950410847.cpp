#include<bits/stdc++.h>
using namespace std;

int main(){
        int n,m;
        cin>>n>>m;
        vector<vector<int>> v(n,vector<int>(m));
        for(int i=0;i<n;i++){
            for(int j=0;j<m;j++){
                cin>>v[i][j];
            }
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