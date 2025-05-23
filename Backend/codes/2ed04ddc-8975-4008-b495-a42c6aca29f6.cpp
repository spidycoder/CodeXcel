#include <bits/stdc++.h>
using namespace std;

int main() {
    int t=1;
    // cin >> t;
    // int caseNum = 1;  // Track original test case number
    while (t--) {
        int n;
        cin >> n;
        vector<pair<int,int>> v(n);
        for (int i = 0; i < n; i++) {
            cin >> v[i].first>>v[i].second;
        }

        for (auto it : v) {
            cout << it.first << " "<<it.second<<endl;
        }
        cout << endl;
        // cout<<"K "<<k<<endl;
    }
    return 0;
}
