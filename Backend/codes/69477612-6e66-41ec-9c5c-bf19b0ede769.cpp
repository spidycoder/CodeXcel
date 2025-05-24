#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    vector<pair<int, int>> intervals(n);
    
    // Input intervals
    for (int i = 0; i < n; i++) {
        cin >> intervals[i].first >> intervals[i].second;
    }

    // Sort intervals by start time
    sort(intervals.begin(), intervals.end());

    vector<pair<int, int>> merged;
    
    for (int i = 0; i < n; i++) {
        // If merged is empty or no overlap, add new interval
        if (merged.empty() || merged.back().second < intervals[i].first) {
            merged.push_back(intervals[i]);
        } else {
            // Overlap: merge the intervals
            merged.back().second = max(merged.back().second, intervals[i].second);
        }
    }

    // Output merged intervals
    for (auto interval : merged) {
        cout << interval.first << " " << interval.second << endl;
    }

    return 0;
}
