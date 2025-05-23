#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    int caseNum = 1;  // Track original test case number
    while (t--) {
        int n;
        cin >> n;
        vector<int> v(n);
        for (int i = 0; i < n; i++) {
            cin >> v[i];
        }
        int k;
        cin>>k;
        cout << "Printing the " << caseNum << "th vector\n";
        caseNum++;

        for (auto it : v) {
            cout << it << " ";
        }
        cout << endl;
        cout<<"K "<<k<<endl;
    }
    return 0;
}
