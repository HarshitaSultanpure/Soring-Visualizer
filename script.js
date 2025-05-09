const n = 20;
let array = [];
let audioCtx = null;
let currentAlgorithm = 'quick'; // Default algorithm

init();

function playNote(freq) {
    if (audioCtx == null) {
        audioCtx = new (AudioContext || webkitAudioContext || window.webkitAudioContext)();
    }
    const dur = 0.1;
    const osc = audioCtx.createOscillator();
    osc.frequency.value = freq;
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
    const node = audioCtx.createGain();
    node.gain.value = 0.1;
    node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
    osc.connect(node);
    node.connect(audioCtx.destination);
}

function init() {
    array = [];
    for (let i = 0; i < n; i++) {
        array[i] = Math.random();
    }
    showBars();
}

function play() {
    const copy = [...array];
let moves = [];

switch (currentAlgorithm) {
    case 'quick':
        moves = quickSort(copy);
        break;
    case 'merge':
        moves = mergeSort(copy);
        break;
    case 'heap':
        moves = heapSort(copy);
        break;
    case 'bubble':
        moves = bubbleSort(copy);
        break;
    case 'selection':
        moves = selectionSort(copy);
        break;
    case 'insertion':
        moves = insertionSort(copy);
        break;
    case 'count':
        moves = countSort(copy);
        break;
    case 'radix':
        moves = radixSort(copy);  // Make sure radixSort is defined
        break;
    case 'bucket':
        moves = bucketSort(copy);
        break;
    case 'shell':
        moves = shellSort(copy);
        break;
    case 'comb':
        moves = combSort(copy);
        break;
    default:
        console.log("Unknown algorithm");
}

animate(moves);
}

function animate(moves) {
    if (moves.length === 0) {
        showBars();
        return;
    }

    const move = moves.shift();

    // Destructure indices safely (some ops like 'overwrite' may use only one index)
    const [i, j] = move.indices;

    if (move.type === "swap") {
        [array[i], array[j]] = [array[j], array[i]];
    } else if (move.type === "overwrite") {
        array[i] = move.value; // Set value at index i
    } else if (move.type === "compare") {
        // No array change — just visual
    }

    // Play notes if indices exist
    if (i !== undefined) playNote(200 + array[i] * 500);
    if (j !== undefined) playNote(200 + array[j] * 500);

    showBars(move);

    setTimeout(() => animate(moves), 200);
}

function quickSort(array) {
    const moves = [];

    function partition(start, end) {
        const pivotValue = array[end];
        let pivotIndex = start;

        for (let i = start; i < end; i++) {
            moves.push({ indices: [i, end], type: "compare" });
            if (array[i] < pivotValue) {
                moves.push({ indices: [i, pivotIndex], type: "swap" });
                [array[i], array[pivotIndex]] = [array[pivotIndex], array[i]];
                pivotIndex++;
            }
        }

        moves.push({ indices: [pivotIndex, end], type: "swap" });
        [array[pivotIndex], array[end]] = [array[end], array[pivotIndex]];
        return pivotIndex;
    }

    function quickSortRecursive(start, end) {
        if (start >= end) return;
        const index = partition(start, end);
        quickSortRecursive(start, index - 1);
        quickSortRecursive(index + 1, end);
    }

    quickSortRecursive(0, array.length - 1);
    return moves;
}

function mergeSort(array) {
    const moves = [];

    function merge(start, mid, end) {
        const left = array.slice(start, mid);
        const right = array.slice(mid, end);
        let i = 0, j = 0, k = start;

        while (i < left.length && j < right.length) {
            // Log comparison
            moves.push({ indices: [k, mid + j], type: "compare" });

            if (left[i] < right[j]) {
                array[k] = left[i];
                moves.push({ indices: [k], type: "overwrite", value: left[i] });
                i++;
            } else {
                array[k] = right[j];
                moves.push({ indices: [k], type: "overwrite", value: right[j] });
                j++;
            }
            k++;
        }

        while (i < left.length) {
            array[k] = left[i];
            moves.push({ indices: [k], type: "overwrite", value: left[i] });
            i++;
            k++;
        }

        while (j < right.length) {
            array[k] = right[j];
            moves.push({ indices: [k], type: "overwrite", value: right[j] });
            j++;
            k++;
        }
    }

    function divide(start, end) {
        if (end - start < 2) return;
        const mid = Math.floor((start + end) / 2);
        divide(start, mid);
        divide(mid, end);
        merge(start, mid, end);
    }

    divide(0, array.length);
    return moves;
}

function heapSort(array) {
    const moves = [];

    function heapify(arr, n, i) {
        let largest = i;
        const left = 2 * i + 1;  // Left child index
        const right = 2 * i + 2; // Right child index

        if (left < n && arr[left] > arr[largest]) {
            moves.push({ indices: [left, largest], type: "compare" });
            largest = left;
        }

        if (right < n && arr[right] > arr[largest]) {
            moves.push({ indices: [right, largest], type: "compare" });
            largest = right;
        }

        if (largest !== i) {
            moves.push({ indices: [i, largest], type: "swap" });
            [arr[i], arr[largest]] = [arr[largest], arr[i]];
            heapify(arr, n, largest); // Recursively heapify the affected sub-tree
        }
    }

    function buildHeap(arr) {
        const n = arr.length;
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(arr, n, i);
        }
    }

    buildHeap(array);

    for (let i = array.length - 1; i > 0; i--) {
        moves.push({ indices: [0, i], type: "swap" });
        [array[0], array[i]] = [array[i], array[0]]; // Move current root to the end
        heapify(array, i, 0); // Heapify the reduced heap
    }

    return moves;
}

function bubbleSort(array) {
    const moves = [];
    let swapped;

    do {
        swapped = false;
        for (let i = 1; i < array.length; i++) {
            if (array[i - 1] > array[i]) {
                swapped = true;
                moves.push({ indices: [i - 1, i], type: "swap" });
                [array[i - 1], array[i]] = [array[i], array[i - 1]];
            }
        }
    } while (swapped);

    return moves;
}

function selectionSort(array) {
    const moves = [];
    
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        
        // Find the minimum element in the unsorted part of the array
        for (let j = i + 1; j < array.length; j++) {
            moves.push({ indices: [j, minIndex], type: "compare" });
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }

        // If minIndex is not the position of the current element, swap
        if (minIndex !== i) {
            moves.push({ indices: [i, minIndex], type: "swap" });
            [array[i], array[minIndex]] = [array[minIndex], array[i]]; // Swap the elements
        }
    }

    return moves;
}

function insertionSort(array) {
    const moves = [];
    
    // Traverse the array from index 1
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        
        // Move elements of array[0..i-1] that are greater than key
        // to one position ahead of their current position
        while (j >= 0 && array[j] > key) {
            moves.push({ indices: [j, j + 1], type: "compare" }); // Compare elements
            array[j + 1] = array[j]; // Shift element to the right
            moves.push({ indices: [j + 1], type: "overwrite", value: array[j + 1] }); // Update bar height
            j = j - 1;
        }
        
        // Place the key at the correct position
        array[j + 1] = key;
        moves.push({ indices: [j + 1], type: "overwrite", value: key }); // Update bar height with key
        
    }

    return moves;
}

function countSort(array) {
    const moves = [];
    
    const max = Math.max(...array); // Find the maximum value in the array
    const min = Math.min(...array); // Find the minimum value in the array
    const range = max - min + 1; // Calculate the range of the array
    
    const count = new Array(range).fill(0); // Create count array for frequencies
    const output = new Array(array.length); // Output array to store sorted values
    
    // Count the occurrences of each element in the input array
    for (let i = 0; i < array.length; i++) {
        // Mapping floating point to an integer index
        const index = Math.floor((array[i] - min) * 100); // Scaling factor for floating points
        count[index]++; // Increment the frequency count
    }
    
    // Update the count array with the running sum of frequencies
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }
    
    // Build the output array using the count array
    for (let i = array.length - 1; i >= 0; i--) {
        const value = array[i];
        const index = Math.floor((value - min) * 100);
        const position = count[index] - 1;
        output[position] = value;
        count[index]--;
        
        moves.push({ indices: [i, position], type: "swap" }); // Log swap for visualizing
        moves.push({ indices: [position], type: "overwrite", value: value }); // Log overwrite for visualizing
    }
    
    // Copy the sorted output array back to the original array
    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        moves.push({ indices: [i], type: "overwrite", value: array[i] }); // Update each bar after sorting
    }
    
    return moves;
}

function radixSort(array) {
    const moves = [];
    
    // Step 1: Find the maximum number to know the number of digits
    const max = Math.max(...array);
    
    // Step 2: Loop through each digit (starting from the least significant digit)
    let exp = 1;  // Start with the least significant digit (1s place)
    
    while (max / exp >= 1) {
        countingSortByDigit(array, exp, moves);
        exp *= 10;  // Move to the next digit (10s, 100s, etc.)
    }
    
    return moves;
}

function countingSortByDigit(array, exp, moves) {
    const output = new Array(array.length); // Output array
    const count = new Array(10).fill(0); // Count array for digits (0-9)

    // Count the occurrences of each digit (based on the exp place)
    for (let i = 0; i < array.length; i++) {
        const digit = Math.floor(array[i] / exp) % 10;
        count[digit]++;
    }

    // Update the count array to hold the actual position of digits
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Build the output array by placing each number in its correct position
    for (let i = array.length - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
        
        // Log the move for visualization
        moves.push({ indices: [i, count[digit] - 1], type: "swap" });
    }

    // Copy the output array to the original array
    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        moves.push({ indices: [i], type: "overwrite", value: array[i] });
    }
}

function bucketSort(array) {
    // Step 1: Find the maximum and minimum values to determine bucket range
    const minValue = Math.min(...array);
    const maxValue = Math.max(...array);

    // Step 2: Create empty buckets
    const bucketCount = Math.floor(array.length);
    const buckets = new Array(bucketCount).fill().map(() => []);

    // Step 3: Distribute the elements into the buckets
    for (let i = 0; i < array.length; i++) {
        const index = Math.floor((array[i] - minValue) / (maxValue - minValue + 1) * bucketCount);
        buckets[index].push(array[i]);
        moves.push({ indices: [i], type: "compare" });
    }

    // Step 4: Sort the individual buckets
    for (let i = 0; i < buckets.length; i++) {
        if (buckets[i].length > 1) {
            // Sort bucket using insertionSort (or any other sorting algorithm)
            insertionSort(buckets[i]);
        }
    }

    // Step 5: Merge all the buckets into the original array
    let index = 0;
    for (let i = 0; i < buckets.length; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            array[index++] = buckets[i][j];
            moves.push({ indices: [index - 1], type: "overwrite", value: array[index - 1] });
        }
    }

    return moves;
}

function shellSort(array) {
    let n = array.length;
    let gap = Math.floor(n / 2);

    // Start with a large gap, then reduce the gap
    while (gap > 0) {
        // Perform a gapped insertion sort for this gap size.
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j = i;

            // Shift earlier gap-sorted elements up until the correct location for array[i] is found
            while (j >= gap && array[j - gap] > temp) {
                array[j] = array[j - gap];
                j -= gap;
            }

            // Put temp (the original array[i]) in the correct location
            array[j] = temp;
        }

        // Reduce the gap for the next iteration
        gap = Math.floor(gap / 2);
    }

    return array; // Return the sorted array
}

function combSort(array) {
    let n = array.length;
    let gap = n;
    let swapped = true;

    // Continue sorting while gap is greater than 1 or there are swaps
    while (gap > 1 || swapped) {
        // Update the gap for the next pass
        gap = Math.floor(gap / 1.3);  // Reduce gap by a factor of 1.3
        if (gap < 1) {
            gap = 1;
        }

        swapped = false; // Reset swapped flag

        // Compare elements at the current gap
        for (let i = 0; i < n - gap; i++) {
            if (array[i] > array[i + gap]) {
                // Swap the elements if they are out of order
                let temp = array[i];
                array[i] = array[i + gap];
                array[i + gap] = temp;
                swapped = true;
            }
        }
    }

    return array; // Return the sorted array
}


function showBars(move) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    for (let i = 0; i < array.length; i++) {
        const bar = document.createElement("div");
        bar.style.height = array[i] * 100 + "%"; // Height based on the value
        bar.classList.add("bar");

        if (move && move.indices.includes(i)) {
            bar.style.background = move.type == "swap" ? "red" : "blue";
        }

        container.appendChild(bar);
    }
}

// Function to change the current algorithm
function selectAlgorithm(algorithm) {
    currentAlgorithm = algorithm;
    init(); // Reinitialize when changing algorithm
}
