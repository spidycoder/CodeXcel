#include<bits/stdc++.h>
using namespace std;
int reverse(int n){
        if(n==0)return n;
        int sum=0;
        while(n){
            sum = (long long)sum*10+(n%10);
            n = n/10;
        }
        return sum;
    }
    bool isPalindrome(int x) {
        // vector<int> v;
        // if(x<0)return false;
        // while(x){
        //     v.push_back(x%10);
        //     x = x/10;
        // }
        // vector<int> a = v;
        // reverse(v.begin(),v.end());
        // return a==v;
        if(x<0)return false;
        int a = reverse(x);
        return a==x;
    }
int main(){
    int t;
    cin>>t;
    while(t--){
        int n;
        cin>>n;
        if(isPalindrome(n)){
            cout<<"true"<<endl;
        }else{
            cout<<"false"<<endl;
        }
    }
    return 0;
}