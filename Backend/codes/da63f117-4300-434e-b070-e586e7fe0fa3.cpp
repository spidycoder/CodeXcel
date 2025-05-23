// Write your code here#include <bits/stdc++.h>
using namespace std;

int main() {
    int t;
    cin >> t;
    while (t--) {
        int n, m;
        cin >> n >> m;
        vector<vector<int>> v(n, vector<int>(m));
        
        // Input matrix
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                cin >> v[i][j];
            }
        }

        // Spiral order traversal
        int top = 0, bottom = n - 1;
        int left = 0, right = m - 1;

        while (top <= bottom && left <= right) {
            // Traverse from Left to Right
            for (int i = left; i <= right; i++)
                cout << v[top][i] << " ";
            top++;

            // Traverse from Top to Bottom
            for (int i = top; i <= bottom; i++)
                cout << v[i][right] << " ";
            right--;

            // Traverse from Right to Left (only if rows remain)
            if (top <= bottom) {
                for (int i = right; i >= left; i--)
                    cout << v[bottom][i] << " ";
                bottom--;
            }

            // Traverse from Bottom to Top (only if columns remain)
            if (left <= right) {
                for (int i = bottom; i >= top; i--)
                    cout << v[i][left] << " ";
                left++;
            }
        }

        cout << endl;
    }

    return 0;
}
