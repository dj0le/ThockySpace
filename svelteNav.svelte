<script>
let isOpen = $state(false);
let activeDropdown = $state(null);

const menuItems = [
  { 
    title: 'Home', 
    href: '/' 
  },
  { 
    title: 'Products', 
    href: '/products',
    dropdown: [
      { title: 'New Arrivals', href: '/products/new' },
      { title: 'Best Sellers', href: '/products/best' },
      { title: 'Deals', href: '/products/deals' }
    ]
  },
  { 
    title: 'About', 
    href: '/about' 
  },
  { 
    title: 'Contact', 
    href: '/contact' 
  }
];

function handleClickOutside(event) {
  const nav = event.target.closest('nav');
  const button = event.target.closest('button');
  
  if (!nav && !button) {
    isOpen = false;
    activeDropdown = null;
  }
}

function toggleDropdown(index) {
  activeDropdown = activeDropdown === index ? null : index;
}

function closeAll() {
  isOpen = false;
  activeDropdown = null;
}
</script>

<svelte:window on:click={handleClickOutside} />

<nav>
  <button 
    aria-label={isOpen ? 'Close Menu' : 'Open Menu'}
    onclick={() => isOpen = !isOpen}
  >
    <div class:open={isOpen}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </button>

  <ul class:open={isOpen}>
    {#each menuItems as item, index}
      <li>
        {#if item.dropdown}
          <button 
            onclick={() => toggleDropdown(index)}
            aria-expanded={activeDropdown === index}
          >
            {item.title}
            <!-- Add dropdown indicator here -->
            <span class:active={activeDropdown === index}>▼</span>
          </button>
          
          {#if activeDropdown === index}
            <ul class="dropdown">
              {#each item.dropdown as subItem}
                <li>
                  <a 
                    href={subItem.href} 
                    onclick={closeAll}
                  >
                    {subItem.title}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        {:else}
          <a 
            href={item.href}
            onclick={closeAll}
          >
            {item.title}
          </a>
        {/if}
      </li>
    {/each}
  </ul>
</nav>

<style>
  /* Add your styles here */
  .dropdown {
    position: absolute;
  }

  @media (max-width: 768px) {
    .dropdown {
      position: static;
    }
  }
</style>