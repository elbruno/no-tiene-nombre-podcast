import { test, expect } from '@playwright/test';
import path from 'path';

const SCREENSHOTS_DIR = path.join(process.cwd(), 'docs', 'screenshots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';

test.describe('Screenshot Generation', () => {
  test.beforeEach(async ({ page }) => {
    // Wait for the page to be ready
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Homepage - Desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, 'home.png'),
      fullPage: true
    });
  });

  test('Homepage - Mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, 'home-mobile.png'),
      fullPage: true
    });
  });

  test('Homepage - Dark Mode', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Toggle to dark mode if available
    const themeToggle = page.locator('[data-testid="theme-toggle"], [aria-label*="theme"], button:has-text("Dark")').first();
    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      await page.waitForTimeout(500); // Wait for theme transition
    }
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, 'home-dark.png'),
      fullPage: true
    });
  });

  test('Episode List View', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Try to navigate to episodes if there's a link
    const episodeLink = page.locator('a:has-text("Episodes"), a:has-text("Episodios"), [href*="episode"]').first();
    if (await episodeLink.isVisible()) {
      await episodeLink.click();
      await page.waitForLoadState('networkidle');
    }
    
    await page.screenshot({ 
      path: path.join(SCREENSHOTS_DIR, 'episode-list.png'),
      fullPage: true
    });
  });

  test('Navigation Component', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Screenshot just the navigation area
    const nav = page.locator('nav, header, [role="navigation"]').first();
    if (await nav.isVisible()) {
      await nav.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, 'navigation.png')
      });
    } else {
      // Fallback to full page if nav not found
      await page.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, 'navigation.png'),
        clip: { x: 0, y: 0, width: 1920, height: 200 }
      });
    }
  });

  test('Footer Component', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Scroll to bottom to ensure footer is visible
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    
    // Screenshot just the footer area
    const footer = page.locator('footer, [role="contentinfo"]').first();
    if (await footer.isVisible()) {
      await footer.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, 'footer.png')
      });
    } else {
      // Fallback to bottom section if footer not found
      await page.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, 'footer.png'),
        clip: { x: 0, y: 880, width: 1920, height: 200 }
      });
    }
  });

  test('Mobile Navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    // Try to open mobile menu if available
    const mobileMenuButton = page.locator('[aria-label*="menu"], [data-testid="mobile-menu"], .hamburger, button:has-text("Menu")').first();
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await page.waitForTimeout(500); // Wait for menu animation
      
      await page.screenshot({ 
        path: path.join(SCREENSHOTS_DIR, 'navigation-mobile-expanded.png'),
        fullPage: true
      });
    }
  });
});