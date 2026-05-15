"""
打飞机游戏 - OOP 重构版
包含：玩家、敌人、子弹、道具系统
"""

import pygame
import sys
import os
import random

# ==================== 音效和图片路径（预留接口） ====================
# 若本地有对应文件，可直接使用；否则程序会生成占位图形
PLAYER_IMG = 'assets/player.png'
BULLET_IMG = 'assets/bullet.png'
LASER_IMG = 'assets/laser.png'
ENEMY_SMALL_IMG = 'assets/enemy_small.png'
ENEMY_LARGE_IMG = 'assets/enemy_large.png'
ITEM_SCATTER_IMG = 'assets/item_scatter.png'   # 散弹道具
ITEM_LASER_IMG = 'assets/item_laser.png'       # 激光道具
BACKGROUND_IMG = 'assets/background.png'

# 音效路径
SOUND_SHOOT = 'assets/shoot.wav'
SOUND_HIT = 'assets/hit.wav'
SOUND_POWERUP = 'assets/powerup.wav'

# ==================== 游戏常量 ====================
WIDTH, HEIGHT = 480, 700
FPS = 60


def load_image(path: str, fallback_size, fallback_draw_func) -> pygame.Surface:
    """
    加载图片，若文件不存在则用 fallback_draw_func 生成占位图。
    fallback_draw_func(surface) 用于在 surface 上绘制。
    """
    try:
        img = pygame.image.load(path)
        return img.convert_alpha()
    except (pygame.error, FileNotFoundError):
        surf = pygame.Surface(fallback_size, pygame.SRCALPHA)
        fallback_draw_func(surf)
        return surf


def load_sound(path: str):
    """加载音效，失败返回 None（静音）。"""
    try:
        return pygame.mixer.Sound(path)
    except (pygame.error, FileNotFoundError):
        return None


# ==================== 道具类型枚举 ====================
SCATTER = 'scatter'  # 散弹
LASER = 'laser'      # 激光


# ==================== 子弹类 Bullet ====================
class Bullet:
    """
    子弹类：表示玩家发射的子弹。
    支持三种模式：普通单发、散弹（多方向）、激光（宽且快）。
    """

    def __init__(self, x: float, y: float, bullet_type: str = 'normal', angle: float = -90):
        self.x = x
        self.y = y
        self.type = bullet_type
        self.angle = angle  # 角度（度），-90 为向上
        self.speed = 12 if bullet_type == LASER else 10
        self.rect = None  # 碰撞矩形，由子类或 update 设置

    def update(self, dt: float = 1.0) -> bool:
        """更新位置，返回 False 表示已出屏可删除。"""
        import math
        rad = math.radians(self.angle)
        self.x += math.cos(rad) * self.speed * dt
        self.y += math.sin(rad) * self.speed * dt
        if self.y < -50 or self.y > HEIGHT + 50 or self.x < -50 or self.x > WIDTH + 50:
            return False
        return True

    def get_collision_rect(self) -> pygame.Rect:
        """返回用于碰撞检测的矩形（不依赖绘制）。"""
        w, h = (8, 25) if self.type == LASER else (5, 15)
        return pygame.Rect(self.x - w // 2, self.y - h // 2, w, h)

    def draw(self, screen: pygame.Surface, img: pygame.Surface) -> None:
        """绘制子弹。"""
        surf = pygame.transform.rotate(img, -self.angle)
        rect = surf.get_rect(center=(self.x, self.y))
        screen.blit(surf, rect)
        self.rect = rect


# ==================== 道具类 Item ====================
class Item:
    """
    道具类：随机掉落的强化道具。
    类型：scatter（散弹）、laser（激光）。
    玩家触碰后获得对应子弹形态，持续一段时间。
    """

    def __init__(self, x: float, y: float, item_type: str):
        self.x = x
        self.y = y
        self.type = item_type
        self.speed = 2
        self.rect = None

    def update(self) -> bool:
        """向下掉落，出屏返回 False。"""
        self.y += self.speed
        if self.y > HEIGHT + 30:
            return False
        return True

    def draw(self, screen: pygame.Surface, img: pygame.Surface) -> None:
        """绘制道具。"""
        rect = img.get_rect(center=(self.x, self.y))
        screen.blit(img, rect)
        self.rect = rect

    def get_rect(self, img: pygame.Surface) -> pygame.Rect:
        return img.get_rect(center=(self.x, self.y))


# ==================== 敌人类 Enemy ====================
class Enemy:
    """
    敌人类：敌方飞机。
    - 小型快机：速度快，血量低。
    - 大型肉盾：速度慢，血量高。
    """

    def __init__(self, x: float, y: float, enemy_type: str = 'small'):
        self.x = x
        self.y = y
        self.type = enemy_type
        if enemy_type == 'small':
            self.speed = 4
            self.hp = 1
            self.score = 10
            self.drop_chance = 0.15  # 15% 掉落道具
        else:  # large
            self.speed = 1.5
            self.hp = 5
            self.score = 50
            self.drop_chance = 0.35  # 35% 掉落道具
        self.rect = None

    def update(self) -> bool:
        """向下移动，出屏返回 False。"""
        self.y += self.speed
        if self.y > HEIGHT + 50:
            return False
        return True

    def take_damage(self, damage: int = 1) -> bool:
        """受到伤害，返回是否已死亡。"""
        self.hp -= damage
        return self.hp <= 0

    def try_drop_item(self) -> Item | None:
        """按概率生成掉落道具。"""
        if random.random() < self.drop_chance:
            t = random.choice([SCATTER, LASER])
            return Item(self.x, self.y, t)
        return None

    def draw(self, screen: pygame.Surface, img: pygame.Surface) -> None:
        """绘制敌人。"""
        rect = img.get_rect(center=(self.x, self.y))
        screen.blit(img, rect)
        self.rect = rect

    def get_rect(self, img: pygame.Surface) -> pygame.Rect:
        return img.get_rect(center=(self.x, self.y))


# ==================== 玩家类 Player ====================
class Player:
    """
    玩家类：玩家控制的飞机。
    负责移动、发射子弹、持有当前子弹类型及剩余时间。
    """

    def __init__(self, x: float, y: float, speed: float = 5):
        self.x = x
        self.y = y
        self.speed = speed
        self.bullet_type = 'normal'
        self.powerup_timer = 0.0  # 道具剩余时间（秒）
        self.rect = None

    def move(self, dx: float, dy: float, screen_width: int, screen_height: int, img_width: int, img_height: int) -> None:
        """限制在屏幕内移动。"""
        self.x = max(0, min(screen_width - img_width, self.x + dx))
        self.y = max(0, min(screen_height - img_height, self.y + dy))

    def shoot(self, bullets: list, bullet_img_w: int, bullet_img_h: int, player_img_w: int) -> list:
        """
        发射子弹，返回新产生的子弹列表。
        普通：1 发；散弹：3 发（左中右）；激光：1 发宽激光。
        """
        cx = self.x + player_img_w // 2 - bullet_img_w // 2
        cy = self.y
        new_bullets = []

        if self.bullet_type == SCATTER:
            for angle in [-15, 0, 15]:
                new_bullets.append(Bullet(cx, cy, SCATTER, angle - 90))
        elif self.bullet_type == LASER:
            new_bullets.append(Bullet(cx, cy, LASER, -90))
        else:
            new_bullets.append(Bullet(cx, cy, 'normal', -90))

        return new_bullets

    def apply_powerup(self, item_type: str, duration: float = 8.0) -> None:
        """拾取道具，设置子弹类型和持续时间。"""
        self.bullet_type = item_type
        self.powerup_timer = duration

    def update_powerup(self, dt: float) -> None:
        """更新道具计时，过期恢复普通子弹。"""
        if self.powerup_timer > 0:
            self.powerup_timer -= dt
            if self.powerup_timer <= 0:
                self.bullet_type = 'normal'

    def get_rect(self, img: pygame.Surface) -> pygame.Rect:
        return img.get_rect(topleft=(self.x, self.y))


# ==================== 主程序 ====================
def main():
    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("打飞机游戏 - OOP 版")

    # 加载资源（优先使用路径，失败则生成占位图）
    def draw_player(s):
        pygame.draw.polygon(s, (255, 0, 0), [(30, 0), (0, 45), (60, 45)])
    player_img = load_image(PLAYER_IMG, (60, 45), draw_player)

    def draw_bullet(s):
        pygame.draw.rect(s, (255, 255, 0), (0, 0, 5, 15))
    bullet_img = load_image(BULLET_IMG, (5, 15), draw_bullet)

    def draw_laser(s):
        pygame.draw.rect(s, (0, 255, 255), (0, 0, 8, 25))
    laser_img = load_image(LASER_IMG, (8, 25), draw_laser)

    def draw_enemy_small(s):
        pygame.draw.polygon(s, (100, 100, 255), [(15, 0), (0, 30), (30, 30)])
    enemy_small_img = load_image(ENEMY_SMALL_IMG, (30, 30), draw_enemy_small)

    def draw_enemy_large(s):
        pygame.draw.polygon(s, (180, 50, 50), [(40, 0), (0, 60), (80, 60)])
    enemy_large_img = load_image(ENEMY_LARGE_IMG, (80, 60), draw_enemy_large)

    def draw_item_scatter(s):
        pygame.draw.circle(s, (255, 200, 0), (15, 15), 12)
        pygame.draw.circle(s, (255, 100, 0), (15, 15), 8)
    item_scatter_img = load_image(ITEM_SCATTER_IMG, (30, 30), draw_item_scatter)

    def draw_item_laser(s):
        pygame.draw.rect(s, (0, 255, 255), (5, 0, 20, 30))
    item_laser_img = load_image(ITEM_LASER_IMG, (30, 30), draw_item_laser)

    # 背景
    background = pygame.Surface((WIDTH, HEIGHT))
    background.fill((135, 206, 250))

    # 音效
    shoot_sound = load_sound(SOUND_SHOOT) or load_sound('shoot.wav')
    powerup_sound = load_sound(SOUND_POWERUP)

    # 游戏对象
    player = Player(WIDTH // 2 - player_img.get_width() // 2, HEIGHT - 60)
    bullets = []
    enemies = []
    items = []
    score = 0
    enemy_spawn_timer = 0.0
    shoot_cooldown = 0.0

    clock = pygame.time.Clock()
    running = True

    while running:
        dt = clock.tick(FPS) / 1000.0

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        # 玩家移动
        keys = pygame.key.get_pressed()
        dx = (keys[pygame.K_RIGHT] - keys[pygame.K_LEFT]) * player.speed
        dy = (keys[pygame.K_DOWN] - keys[pygame.K_UP]) * player.speed
        player.move(dx, dy, WIDTH, HEIGHT, player_img.get_width(), player_img.get_height())

        # 发射子弹（空格 + 冷却）
        shoot_cooldown -= dt
        if keys[pygame.K_SPACE] and shoot_cooldown <= 0:
            cd = 0.15 if player.bullet_type == 'normal' else 0.2
            shoot_cooldown = cd
            b_list = player.shoot(bullets, bullet_img.get_width(), bullet_img.get_height(), player_img.get_width())
            bullets.extend(b_list)
            if shoot_sound:
                shoot_sound.play()

        # 道具计时
        player.update_powerup(dt)

        # 生成敌人
        enemy_spawn_timer -= dt
        if enemy_spawn_timer <= 0:
            enemy_spawn_timer = random.uniform(0.8, 1.8)
            ex = random.randint(40, WIDTH - 40)
            et = 'large' if random.random() < 0.3 else 'small'
            enemies.append(Enemy(ex, -30, et))

        # 更新子弹
        bullet_img_use = laser_img if player.bullet_type == LASER else bullet_img
        bullets = [b for b in bullets if b.update(dt)]

        # 更新敌人
        for e in enemies:
            e.update()
        enemies = [e for e in enemies if e.y <= HEIGHT + 50]

        # 更新道具
        items = [i for i in items if i.update()]

        # 子弹 vs 敌人 碰撞
        for b in bullets[:]:
            br = b.get_collision_rect()
            for e in enemies[:]:
                er = e.get_rect(enemy_small_img if e.type == 'small' else enemy_large_img)
                if br.colliderect(er):
                    dmg = 2 if b.type == LASER else 1
                    if e.take_damage(dmg):
                        score += e.score
                        enemies.remove(e)
                        dropped = e.try_drop_item()
                        if dropped:
                            items.append(dropped)
                    bullets.remove(b)
                    break

        # 玩家 vs 道具 碰撞
        pr = player.get_rect(player_img)
        for i in items[:]:
            ir = i.get_rect(item_scatter_img if i.type == SCATTER else item_laser_img)
            if pr.colliderect(ir):
                player.apply_powerup(i.type)
                items.remove(i)
                if powerup_sound:
                    powerup_sound.play()

        # 绘制
        screen.blit(background, (0, 0))
        for i in items:
            img = item_scatter_img if i.type == SCATTER else item_laser_img
            i.draw(screen, img)
        for e in enemies:
            img = enemy_small_img if e.type == 'small' else enemy_large_img
            e.draw(screen, img)
        for b in bullets:
            img = laser_img if b.type == LASER else bullet_img
            b.draw(screen, img)
        screen.blit(player_img, (player.x, player.y))

        # 显示分数和道具状态
        font = pygame.font.Font(None, 36)
        score_text = font.render(f'Score: {score}', True, (0, 0, 0))
        screen.blit(score_text, (10, 10))
        if player.powerup_timer > 0:
            mode_text = font.render(f'{player.bullet_type} {player.powerup_timer:.1f}s', True, (255, 100, 0))
            screen.blit(mode_text, (10, 45))

        pygame.display.flip()

    pygame.quit()
    sys.exit()


if __name__ == '__main__':
    main()
