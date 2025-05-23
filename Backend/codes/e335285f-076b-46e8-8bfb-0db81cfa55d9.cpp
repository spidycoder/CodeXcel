#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
using namespace std;

string longestCommonPrefix(vector<string>& strs) {
    if (strs.empty()) return "";

    // Sort the strings to bring most different ones to the ends
    sort(strs.begin(), strs.end());

    string first = strs[0];
    string last = strs.back();
    int i = 0;

    // Compare characters of first and last string
    while (i < first.size() && i < last.size() && first[i] == last[i]) {
        i++;
    }

    return first.substr(0, i);
}

int main() {
    int t;
    cin>>t;
    while(t--){
        int n;
        cin >> n;
        vector<string> strs(n);
        for (int i = 0; i < n; ++i) {
            cin >> strs[i];
        }
        string result = longestCommonPrefix(strs);
        cout << result << endl;
    }

    return 0;
}
