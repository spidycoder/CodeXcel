#include<bits/stdc++.h>
using namespace std;

int main(){
    int t;
    cin>>t;
    while(t--){
        int n;
        cin>>n;
        vector<int> v(n);
        for(int i=0;i<n;i++){
            cin>>v[i];
        }
        cout<<"Printing the "<<(t)"th vector\n";
        for(auto it:v){

            cout<<it<<" ";
        }
        cout<<endl;
    }
    return 0;
}