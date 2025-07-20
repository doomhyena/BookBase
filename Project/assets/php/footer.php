<?php

    echo '<footer class="bg-gray-900 text-gray-200 py-8 mt-12">
            <div class="container mx-auto px-4 text-center">
                <p class="text-lg font-semibold mb-2">&copy; ' . date("Y") . ' BookBase. All rights reserved.</p>
                <hr class="border-gray-700 my-4">
                <p class="mb-2">Fejlesztette: <a href="https://doomhyena.hu" target="_blank" class="text-blue-400 hover:underline">Doomhyena</a></p>
                <p class="mb-2">További információ az oldalról: <a href="https://github.com/doomhyena/BookBase" target="_blank" class="text-blue-400 hover:underline">Github</a></p>
                <p class="mb-4">Version: <span class="font-mono">1.0.0</span></p>
                <div class="flex flex-col md:flex-row justify-center gap-4 text-sm">
                <a href="/privacy-policy" class="hover:underline text-gray-400">Adatvédelmi irányelvek</a>
                <span class="hidden md:inline-block text-gray-500">|</span>
                <a href="/contact" class="hover:underline text-gray-400">Kapcsolat</a>
                <span class="hidden md:inline-block text-gray-500">|</span>
                <a href="https://github.com/doomhyena/BookBase" target="_blank" class="hover:underline text-gray-400">GitHub</a>
                </div>
            </div>
        </footer>';

?>