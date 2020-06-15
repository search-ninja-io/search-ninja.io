<script>
    import { clickOutside } from '../../utils/click-outside.js';

    let showUserDropdown = false;
    const toggleUserDropDown = () => (showUserDropdown = !showUserDropdown);
    const handleClickOutside = (event) => (showUserDropdown = false);
</script>

<ul class="navbar-nav align-items-center ml-auto ml-md-0 ">
    <li class:show="{showUserDropdown}" class="nav-item dropdown">
        <a
            use:clickOutside
            on:click_outside="{handleClickOutside}"
            on:click="{toggleUserDropDown}"
            class="nav-link pr-0"
            href="/"
            role="button"
            aria-haspopup="true"
            aria-expanded="{showUserDropdown}"
        >
            <div class="media align-items-center">
                <span class="avatar avatar-sm rounded-circle">
                    <img alt="Placeholder 4" src="/vendor/argon-dashboard/img/theme/team-4.jpg" />
                </span>
                <div class="media-body ml-2 d-none d-lg-block">
                    <span class="mb-0 text-sm font-weight-bold">John Snow</span>
                </div>
            </div>
        </a>
        <div class:show="{showUserDropdown}" class="dropdown-menu dropdown-menu-right">
            <div class="dropdown-header noti-title">
                <h6 class="text-overflow m-0">Welcome!</h6>
            </div>
            <a href="#!" class="dropdown-item">
                <i class="ni ni-single-02"></i>
                <span>My profile</span>
            </a>
            <a href="#!" class="dropdown-item">
                <i class="ni ni-settings-gear-65"></i>
                <span>Settings</span>
            </a>
            <a href="#!" class="dropdown-item">
                <i class="ni ni-calendar-grid-58"></i>
                <span>Activity</span>
            </a>
            <a href="#!" class="dropdown-item">
                <i class="ni ni-support-16"></i>
                <span>Support</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#!" class="dropdown-item">
                <i class="ni ni-user-run"></i>
                <span>Logout</span>
            </a>
        </div>
    </li>
</ul>
